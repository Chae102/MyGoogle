import { useState, useEffect, useCallback } from "react";

const card = {
  background:"#fff", borderRadius:8, padding:"18px 20px",
  boxShadow:"0 1px 6px rgba(32,33,36,.12)", border:"1px solid #dadce0",
  display:"flex", flexDirection:"column",
};
const cardTitle = {
  fontSize:11, fontWeight:600, color:"#5f6368", letterSpacing:.8,
  textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:6
};

/* ── CLOCK ── */
function ClockCard() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const pad = n => String(n).padStart(2,"0");
  const days = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
  const months = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  return (
    <div style={card}>
      <div style={cardTitle}><span>🕐</span> 현재 시간</div>
      <div style={{flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"8px 0"}}>
        <div style={{fontSize:48, fontWeight:300, color:"#202124", letterSpacing:-1, lineHeight:1}}>
          {pad(time.getHours())}:{pad(time.getMinutes())}
          <span style={{fontSize:24, color:"#9aa0a6"}}>:{pad(time.getSeconds())}</span>
        </div>
        <div style={{marginTop:10, display:"flex", gap:8, alignItems:"center"}}>
          <span style={{background:"#4285F4", color:"#fff", borderRadius:4, padding:"3px 10px", fontSize:12, fontWeight:500}}>{days[time.getDay()]}</span>
          <span style={{fontSize:14, color:"#5f6368"}}>{time.getFullYear()}년 {months[time.getMonth()]} {time.getDate()}일</span>
        </div>
      </div>
    </div>
  );
}

/* ── WEATHER ── */
const WX_CODE = {
  0:"☀️ 맑음",1:"🌤 대체로 맑음",2:"⛅ 구름 조금",3:"☁️ 흐림",
  45:"🌫 안개",48:"🌫 안개",51:"🌦 이슬비",53:"🌦 이슬비",55:"🌦 이슬비",
  61:"🌧 비",63:"🌧 비",65:"🌧 폭우",71:"❄️ 눈",73:"❄️ 눈",75:"❄️ 폭설",
  80:"🌦 소나기",81:"🌦 소나기",82:"⛈ 폭우",95:"⛈ 천둥번개"
};
const WX_EMOJI = {
  0:"☀️",1:"🌤",2:"⛅",3:"☁️",45:"🌫",48:"🌫",51:"🌦",53:"🌦",55:"🌦",
  61:"🌧",63:"🌧",65:"🌧",71:"❄️",73:"❄️",75:"❄️",80:"🌦",81:"🌦",82:"⛈",95:"⛈"
};

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) { setErr("위치 접근 불가"); setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m,apparent_temperature` +
          `&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=1`
        );
        const d = await res.json();
        const c = d.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          desc: WX_CODE[c.weathercode] || "🌡 날씨",
          emoji: WX_EMOJI[c.weathercode] || "🌡",
          wind: Math.round(c.windspeed_10m),
          humidity: c.relative_humidity_2m,
        });
        // Build hourly: next 6 slots from current hour
        const now = new Date();
        const curH = now.getHours();
        const slots = [];
        for (let i = 0; i < d.hourly.time.length && slots.length < 6; i++) {
          const h = new Date(d.hourly.time[i]).getHours();
          if (new Date(d.hourly.time[i]) >= now || h === curH) {
            slots.push({ hour: h, temp: Math.round(d.hourly.temperature_2m[i]), emoji: WX_EMOJI[d.hourly.weathercode[i]] || "🌡" });
          }
        }
        setHourly(slots);
      } catch { setErr("날씨 로드 실패"); }
      setLoading(false);
    }, () => { setErr("위치 권한이 필요합니다"); setLoading(false); });
  }, []);

  return (
    <div style={card}>
      <div style={cardTitle}><span>🌤</span> 오늘의 날씨</div>
      {loading && <div style={{color:"#9aa0a6", fontSize:13, flex:1, display:"flex", alignItems:"center", justifyContent:"center"}}>위치 확인 중...</div>}
      {err && <div style={{color:"#d93025", fontSize:13}}>{err}</div>}
      {weather && (
        <div style={{flex:1, display:"flex", flexDirection:"column", gap:14}}>
          {/* Current */}
          <div style={{display:"flex", alignItems:"flex-end", gap:12}}>
            <div style={{fontSize:52, lineHeight:1}}>{weather.emoji}</div>
            <div>
              <div style={{fontSize:40, fontWeight:300, color:"#202124", lineHeight:1}}>{weather.temp}°</div>
              <div style={{fontSize:12, color:"#5f6368", marginTop:2}}>{weather.desc.replace(/^.+?\s/,"")}</div>
            </div>
            <div style={{marginLeft:"auto", display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end"}}>
              {[["💨", `${weather.wind}km/h`],["💧", `${weather.humidity}%`],["🌡", `체감 ${weather.feels}°`]].map(([ico,val])=>(
                <div key={val} style={{fontSize:12, color:"#5f6368"}}>{ico} {val}</div>
              ))}
            </div>
          </div>
          {/* Divider */}
          <div style={{height:1, background:"#e8eaed"}}/>
          {/* Hourly forecast */}
          <div>
            <div style={{fontSize:10, color:"#9aa0a6", fontWeight:600, letterSpacing:.5, marginBottom:8}}>시간별 예보</div>
            <div style={{display:"flex", gap:4, justifyContent:"space-between"}}>
              {hourly.map((h, i) => (
                <div key={i} style={{flex:1, textAlign:"center", background: i===0?"#e8f0fe":"#f8f9fa", borderRadius:8, padding:"6px 2px"}}>
                  <div style={{fontSize:10, color: i===0?"#1a73e8":"#9aa0a6", fontWeight:600}}>{i===0?"지금":`${h.hour}시`}</div>
                  <div style={{fontSize:16, margin:"4px 0"}}>{h.emoji}</div>
                  <div style={{fontSize:12, fontWeight:500, color: i===0?"#1a73e8":"#3c4043"}}>{h.temp}°</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── TODO ── */
function TodoCard() {
  const [todos, setTodos] = useState([{id:1, text:"오늘의 할 일을 추가해 보세요!", done:false}]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const add = () => { const t=input.trim(); if(!t) return; setTodos(p=>[...p,{id:Date.now(),text:t,done:false}]); setInput(""); };
  const toggle = id => setTodos(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const remove = id => setTodos(p=>p.filter(t=>t.id!==id));
  const done = todos.filter(t=>t.done).length;
  const allDone = todos.length > 0 && done === todos.length;
  return (
    <div style={card}>
      <div style={{...cardTitle, justifyContent:"space-between"}}>
        <span style={{display:"flex", alignItems:"center", gap:6}}><span>✅</span> 오늘의 할 일</span>
        <span style={{fontSize:11, color: allDone?"#34A853":"#9aa0a6", fontWeight:600}}>{allDone?"🎉 완료!": `${done}/${todos.length}`}</span>
      </div>
      <div style={{height:3, background:"#e8eaed", borderRadius:2, marginBottom:12}}>
        <div style={{height:"100%", borderRadius:2, background:allDone?"#34A853":"#4285F4", width:`${todos.length?(done/todos.length)*100:0}%`, transition:"width 0.3s"}}/>
      </div>
      <div style={{flex:1, overflowY:"auto", maxHeight:180, marginBottom:12}}>
        {todos.length===0 && <div style={{textAlign:"center", color:"#9aa0a6", fontSize:13, padding:"20px 0"}}>할 일을 추가해 보세요 🎯</div>}
        {todos.map((todo,i) => (
          <div key={todo.id} style={{display:"flex", alignItems:"center", gap:10, padding:"7px 4px", borderBottom:i<todos.length-1?"1px solid #f1f3f4":"none"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8f9fa"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >
            <div onClick={()=>toggle(todo.id)} style={{width:18, height:18, borderRadius:3, flexShrink:0, cursor:"pointer", border:todo.done?"none":"2px solid #dadce0", background:todo.done?"#34A853":"transparent", display:"flex", alignItems:"center", justifyContent:"center"}}>
              {todo.done && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{flex:1, fontSize:13, color:todo.done?"#9aa0a6":"#202124", textDecoration:todo.done?"line-through":"none", cursor:"pointer"}} onClick={()=>toggle(todo.id)}>{todo.text}</span>
            <svg onClick={()=>remove(todo.id)} width="15" height="15" viewBox="0 0 24 24" fill="#dadce0" style={{cursor:"pointer", flexShrink:0}}
              onMouseEnter={e=>e.target.setAttribute("fill","#ea4335")}
              onMouseLeave={e=>e.target.setAttribute("fill","#dadce0")}
            ><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </div>
        ))}
      </div>
      <div style={{display:"flex", gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="새 할 일 추가..."
          style={{flex:1, padding:"8px 12px", borderRadius:4, fontSize:13, fontFamily:"inherit", border:focused?"1px solid #4285F4":"1px solid #dadce0", outline:"none", color:"#202124"}}
        />
        <button onClick={add} style={{padding:"8px 14px", borderRadius:4, border:"none", background:"#4285F4", color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit"}}
          onMouseEnter={e=>e.target.style.background="#1a73e8"} onMouseLeave={e=>e.target.style.background="#4285F4"}
        >추가</button>
      </div>
    </div>
  );
}

/* ── NEWS ── */
const CATEGORIES = [
  { id:"all",   label:"전체",   query:"최신 IT 기술 뉴스" },
  { id:"ai",    label:"🤖 AI",  query:"인공지능 AI 최신 뉴스" },
  { id:"sec",   label:"🔒 보안", query:"사이버 보안 해킹 최신 뉴스" },
  { id:"mobile",label:"📱 모바일",query:"스마트폰 모바일 앱 최신 뉴스" },
  { id:"startup",label:"🚀 스타트업",query:"스타트업 테크 투자 최신 뉴스" },
  { id:"ev",    label:"🚗 EV·로봇",query:"전기차 로봇 자율주행 최신 뉴스" },
];

function NewsCard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState("all");

  const fetchNews = useCallback(async (categoryId) => {
    setLoading(true);
    setNews([]);
    const q = CATEGORIES.find(c=>c.id===categoryId)?.query || "최신 IT 기술 뉴스";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1200,
          tools:[{type:"web_search_20250305", name:"web_search"}],
          messages:[{role:"user", content:`"${q}" 키워드로 오늘 기준 최신 뉴스 5개를 검색해서 아래 JSON 형식으로만 답해줘. 마크다운 없이 순수 JSON 배열만 출력해.\n[{"title":"뉴스 제목","summary":"한두 줄 요약","source":"출처","url":"링크 URL"}]`}]
        })
      });
      const data = await res.json();
      const text = data.content.map(b=>b.type==="text"?b.text:"").join("");
      setNews(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch {
      setNews([{title:"뉴스를 불러오지 못했습니다", summary:"잠시 후 다시 시도해 주세요.", source:"", url:""}]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchNews("all"); }, []);

  const handleCat = (id) => { setCat(id); fetchNews(id); };
  const colors = ["#4285F4","#EA4335","#FBBC05","#34A853","#4285F4"];

  return (
    <div style={card}>
      {/* Header */}
      <div style={{...cardTitle, justifyContent:"space-between"}}>
        <span style={{display:"flex", alignItems:"center", gap:6}}><span>📰</span> 최신 기술 뉴스</span>
        <button onClick={()=>fetchNews(cat)} disabled={loading} style={{fontSize:11, padding:"3px 10px", borderRadius:4, border:"1px solid #dadce0", background:"#fff", cursor:"pointer", color:"#1a73e8", fontWeight:600, fontFamily:"inherit"}}>
          {loading?"로딩 중...":"새로고침"}
        </button>
      </div>

      {/* Category filter */}
      <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:12}}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={()=>handleCat(c.id)} style={{
            padding:"4px 10px", borderRadius:16, fontSize:11, fontWeight:600,
            border: cat===c.id ? "none" : "1px solid #dadce0",
            background: cat===c.id ? "#1a73e8" : "#fff",
            color: cat===c.id ? "#fff" : "#5f6368",
            cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s"
          }}>{c.label}</button>
        ))}
      </div>

      {/* News list */}
      {loading && (
        <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, padding:"20px 0", color:"#9aa0a6"}}>
          <div style={{display:"flex", gap:6}}>
            {["#4285F4","#EA4335","#FBBC05","#34A853"].map((c,i)=>(
              <div key={i} style={{width:8, height:8, borderRadius:"50%", background:c, animation:`bounce 1s ${i*0.15}s infinite`}}/>
            ))}
          </div>
          <div style={{fontSize:12}}>뉴스를 가져오는 중...</div>
          <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
        </div>
      )}
      {!loading && (
        <div style={{flex:1, overflowY:"auto"}}>
          {news.map((item,i) => (
            <a key={i} href={item.url||"#"} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none", display:"block"}}>
              <div style={{display:"flex", gap:10, padding:"9px 4px", borderBottom:i<news.length-1?"1px solid #e8eaed":"none"}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8f9fa"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <div style={{width:3, borderRadius:2, background:colors[i%5], flexShrink:0, alignSelf:"stretch", minHeight:36}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13, fontWeight:500, color:"#1a0dab", marginBottom:2, lineHeight:1.4}}>{item.title}</div>
                  <div style={{fontSize:11, color:"#4d5156", lineHeight:1.5}}>{item.summary}</div>
                  {item.source && <div style={{fontSize:10, color:"#9aa0a6", marginTop:2}}>{item.source}</div>}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── SEARCH BAR ── */
function SearchBar() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const search = e => {
    if (!q.trim()) return;
    window.open(e==="google"?`https://www.google.com/search?q=${encodeURIComponent(q)}`:`https://search.naver.com/search.naver?query=${encodeURIComponent(q)}`,"_blank");
  };
  return (
    <div style={{width:"100%", maxWidth:584, margin:"0 auto"}}>
      <div style={{display:"flex", alignItems:"center", border:focused?"1px solid transparent":"1px solid #dfe1e5", borderRadius:24, padding:"10px 16px", boxShadow:focused?"0 1px 6px rgba(32,33,36,.28)":"none", background:"#fff", gap:10}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round"/></svg>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search("google")}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="Google 검색 또는 URL 입력"
          style={{flex:1, border:"none", outline:"none", fontSize:16, color:"#202124", background:"transparent"}}
        />
        {q && <svg onClick={()=>setQ("")} width="18" height="18" viewBox="0 0 24 24" fill="#9aa0a6" style={{cursor:"pointer"}}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>}
        <div style={{width:1, height:24, background:"#dfe1e5"}}/>
        <svg onClick={()=>search("google")} width="24" height="24" viewBox="0 0 48 48" style={{cursor:"pointer", flexShrink:0}}>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
      </div>
      <div style={{display:"flex", justifyContent:"center", gap:10, marginTop:16}}>
        {["Google 검색","Naver 검색"].map((label,i)=>(
          <button key={i} onClick={()=>search(i===0?"google":"naver")} style={{padding:"9px 20px", borderRadius:4, border:"1px solid #f8f9fa", background:"#f8f9fa", color:"#3c4043", fontSize:14, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 1px 1px rgba(0,0,0,.1)"}}
            onMouseEnter={e=>{e.target.style.border="1px solid #dadce0"; e.target.style.boxShadow="0 1px 3px rgba(0,0,0,.2)";}}
            onMouseLeave={e=>{e.target.style.border="1px solid #f8f9fa"; e.target.style.boxShadow="0 1px 1px rgba(0,0,0,.1)";}}
          >{label}</button>
        ))}
      </div>
    </div>
  );
}

/* ── APP ── */
export default function App() {
  return (
    <div style={{minHeight:"100vh", background:"#f8f9fa", fontFamily:"'Google Sans',Roboto,Arial,sans-serif", display:"flex", flexDirection:"column"}}>
      <div style={{display:"flex", justifyContent:"flex-end", alignItems:"center", padding:"14px 24px", gap:16, background:"#fff", borderBottom:"1px solid #e8eaed"}}>
        <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" style={{fontSize:13, color:"#202124", textDecoration:"none"}}>Gmail</a>
        <a href="https://www.google.com/imghp" target="_blank" rel="noopener noreferrer" style={{fontSize:13, color:"#202124", textDecoration:"none"}}>이미지</a>
        <div style={{width:36, height:36, borderRadius:"50%", background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:500, cursor:"pointer"}}>나</div>
      </div>

      <div style={{background:"#fff", paddingTop:36, paddingBottom:32, display:"flex", flexDirection:"column", alignItems:"center", borderBottom:"1px solid #e8eaed"}}>
        <div style={{fontSize:64, fontWeight:300, letterSpacing:-2, marginBottom:20, lineHeight:1}}>
          {"Google".split("").map((ch,i)=>{
            const c=["#4285F4","#EA4335","#FBBC05","#4285F4","#34A853","#EA4335"][i];
            return <span key={i} style={{color:c}}>{ch}</span>;
          })}
        </div>
        <SearchBar />
      </div>

      <div style={{flex:1, maxWidth:900, width:"100%", margin:"28px auto", padding:"0 20px", boxSizing:"border-box"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
          <ClockCard />
          <TodoCard />
          <WeatherCard />
          <NewsCard />
        </div>
      </div>

      <div style={{borderTop:"1px solid #e8eaed", background:"#f2f2f2", padding:"14px 24px", display:"flex", justifyContent:"space-between", fontSize:13, color:"#70757a"}}>
        <span>대한민국</span>
        <div style={{display:"flex", gap:20}}>
          <span style={{cursor:"pointer"}}>개인정보처리방침</span>
          <span style={{cursor:"pointer"}}>설정</span>
        </div>
      </div>
    </div>
  );
}