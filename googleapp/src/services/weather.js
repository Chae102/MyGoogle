const WEATHER_LABELS = {
  0: "맑음",
  1: "대체로 맑음",
  2: "구름 조금",
  3: "흐림",
  45: "안개",
  48: "안개",
  51: "이슬비",
  53: "이슬비",
  55: "이슬비",
  61: "비",
  63: "비",
  65: "폭우",
  71: "눈",
  73: "눈",
  75: "폭설",
  80: "소나기",
  81: "소나기",
  82: "강한 소나기",
  95: "천둥번개",
};

const WEATHER_ICONS = {
  0: "☀️",
  1: "🌤",
  2: "⛅",
  3: "☁️",
  45: "🌫",
  48: "🌫",
  51: "🌦",
  53: "🌦",
  55: "🌦",
  61: "🌧",
  63: "🌧",
  65: "🌧",
  71: "❄️",
  73: "❄️",
  75: "❄️",
  80: "🌦",
  81: "🌦",
  82: "⛈",
  95: "⛈",
};

const getWeatherLabel = (code) => WEATHER_LABELS[code] || "날씨";
const getWeatherIcon = (code) => WEATHER_ICONS[code] || "🌡";

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("이 브라우저는 위치 정보를 지원하지 않습니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 10 * 60 * 1000,
      timeout: 10000,
    });
  });
}

export async function fetchCurrentWeather({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    hourly: ["temperature_2m", "weather_code"].join(","),
    timezone: "auto",
    forecast_days: "1",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!response.ok) {
    throw new Error("날씨 API 요청에 실패했습니다.");
  }

  const data = await response.json();
  const current = data.current;

  if (!current || !data.hourly) {
    throw new Error("날씨 API 응답 형식이 올바르지 않습니다.");
  }

  const now = new Date();
  const currentHour = now.getHours();
  const hourly = [];

  for (let i = 0; i < data.hourly.time.length && hourly.length < 6; i += 1) {
    const slotTime = new Date(data.hourly.time[i]);

    if (slotTime >= now || slotTime.getHours() === currentHour) {
      const code = data.hourly.weather_code[i];
      hourly.push({
        hour: slotTime.getHours(),
        temp: Math.round(data.hourly.temperature_2m[i]),
        icon: getWeatherIcon(code),
      });
    }
  }

  return {
    current: {
      temp: Math.round(current.temperature_2m),
      feels: Math.round(current.apparent_temperature),
      desc: getWeatherLabel(current.weather_code),
      icon: getWeatherIcon(current.weather_code),
      wind: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
    },
    hourly,
  };
}
