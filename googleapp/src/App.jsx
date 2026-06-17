import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchLatestNews } from "./services/news";
import { fetchCurrentWeather, getCurrentPosition } from "./services/weather";

const getCardStyle = (theme) => ({
  background: theme.surface,
  borderRadius: 14,
  padding: "20px 22px",
  boxShadow: theme.mode === "dark"
    ? "0 4px 14px rgba(0,0,0,.28)"
    : "0 4px 14px rgba(32,33,36,.10)",
  border: `1px solid ${theme.border}`,
  display: "flex",
  flexDirection: "column",
  minHeight: 270,
  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
});

const getCardTitleStyle = (theme) => ({
  fontSize: 13,
  fontWeight: 700,
  color: theme.text,
  letterSpacing: 0,
  textTransform: "uppercase",
  marginBottom: 16,
  display: "flex",
  alignItems: "center",
  gap: 8,
});

/* ── CLOCK ── */
function ClockCard({ theme }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const pad = n => String(n).padStart(2,"0");
  const days = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
  const months = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  return (
    <div className="dashboard-card" style={getCardStyle(theme)}>
      <div style={getCardTitleStyle(theme)}><span style={{fontSize:16}}>🕐</span> 현재 시간</div>
      <div style={{flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"12px 0"}}>
        <div style={{fontSize:48, fontWeight:300, color:theme.text, letterSpacing:0, lineHeight:1}}>
          {pad(time.getHours())}:{pad(time.getMinutes())}
          <span style={{fontSize:24, color:theme.muted}}>:{pad(time.getSeconds())}</span>
        </div>
        <div style={{marginTop:10, display:"flex", gap:8, alignItems:"center"}}>
          <span style={{background:theme.accentColor, color:"#fff", borderRadius:999, padding:"4px 11px", fontSize:12, fontWeight:700}}>{days[time.getDay()]}</span>
          <span style={{fontSize:14, color:theme.subText}}>{time.getFullYear()}년 {months[time.getMonth()]} {time.getDate()}일</span>
        </div>
      </div>
    </div>
  );
}

function WeatherCard({ theme }) {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadWeather() {
      setLoading(true);
      setErr(null);

      try {
        const position = await getCurrentPosition();
        const forecast = await fetchCurrentWeather(position.coords);

        if (!ignore) {
          setWeather(forecast.current);
          setHourly(forecast.hourly);
        }
      } catch (error) {
        if (!ignore) {
          setErr(error.message || "날씨를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="dashboard-card" style={getCardStyle(theme)}>
      <div style={getCardTitleStyle(theme)}><span style={{fontSize:16}}>🌤</span> 오늘의 날씨</div>
      {loading && <div style={{color:theme.muted, fontSize:13, flex:1, display:"flex", alignItems:"center", justifyContent:"center"}}>위치 확인 중...</div>}
      {err && <div style={{color:theme.danger, fontSize:13}}>{err}</div>}
      {weather && (
        <div style={{flex:1, display:"flex", flexDirection:"column", gap:14}}>
          {/* Current */}
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <div style={{fontSize:52, lineHeight:1}}>{weather.icon}</div>
            <div>
              <div style={{fontSize:40, fontWeight:300, color:theme.text, lineHeight:1}}>{weather.temp}°</div>
              <div style={{fontSize:12, color:theme.subText, marginTop:2}}>{weather.desc}</div>
            </div>
            <div style={{marginLeft:"auto", display:"flex", flexWrap:"wrap", gap:6, justifyContent:"flex-end"}}>
              {[["💨", `${weather.wind}km/h`],["💧", `${weather.humidity}%`],["🌡", `체감 ${weather.feels}°`]].map(([ico,val])=>(
                <div key={val} style={{fontSize:11, color:theme.subText, background:theme.surfaceAlt, border:`1px solid ${theme.divider}`, borderRadius:999, padding:"4px 8px", whiteSpace:"nowrap"}}>{ico} {val}</div>
              ))}
            </div>
          </div>
          {/* Divider */}
          <div style={{height:1, background:theme.divider}}/>
          {/* Hourly forecast */}
          <div>
            <div style={{fontSize:10, color:theme.muted, fontWeight:600, letterSpacing:.5, marginBottom:8}}>시간별 예보</div>
            <div style={{display:"flex", gap:4, justifyContent:"space-between"}}>
              {hourly.map((h, i) => (
                <div key={i} style={{flex:1, textAlign:"center", background: i===0 ? `${theme.accentColor}22` : theme.surfaceAlt, borderRadius:10, padding:"8px 4px", border:`1px solid ${i===0 ? `${theme.accentColor}44` : "transparent"}`}}>
                  <div style={{fontSize:10, color: i===0?theme.accentColor:theme.muted, fontWeight:600}}>{i===0?"지금":`${h.hour}시`}</div>
                  <div style={{fontSize:16, margin:"4px 0"}}>{h.icon}</div>
                  <div style={{fontSize:12, fontWeight:500, color: i===0?theme.accentColor:theme.text}}>{h.temp}°</div>
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
function TodoCard({ theme }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const add = () => { const t=input.trim(); if(!t) return; setTodos(p=>[...p,{id:Date.now(),text:t,done:false}]); setInput(""); };
  const toggle = id => setTodos(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const remove = id => setTodos(p=>p.filter(t=>t.id!==id));
  const done = todos.filter(t=>t.done).length;
  const allDone = todos.length > 0 && done === todos.length;
  return (
    <div className="dashboard-card" style={getCardStyle(theme)}>
      <div style={{...getCardTitleStyle(theme), justifyContent:"space-between"}}>
        <span style={{display:"flex", alignItems:"center", gap:8}}><span style={{fontSize:16}}>✅</span> 오늘의 할 일</span>
        <span style={{fontSize:11, color: allDone?theme.success:theme.muted, fontWeight:600}}>{allDone?"🎉 완료!": `${done}/${todos.length}`}</span>
      </div>
      <div style={{height:4, background:theme.divider, borderRadius:999, marginBottom:14}}>
        <div style={{height:"100%", borderRadius:2, background:allDone?theme.success:theme.accentColor, width:`${todos.length?(done/todos.length)*100:0}%`, transition:"width 0.3s"}}/>
      </div>
      <div style={{flex:1, overflowY:"auto", maxHeight:190, marginBottom:14, display:"flex", flexDirection:"column", justifyContent:todos.length===0?"center":"flex-start"}}>
        {todos.length===0 && <div style={{textAlign:"center", color:theme.muted, fontSize:13, padding:"22px 0"}}>할 일을 추가해 보세요 🎯</div>}
        {todos.map((todo,i) => (
          <div key={todo.id} style={{display:"flex", alignItems:"center", gap:10, padding:"9px 6px", borderRadius:8, borderBottom:i<todos.length-1?`1px solid ${theme.divider}`:"none"}}
            onMouseEnter={e=>e.currentTarget.style.background=theme.surfaceAlt}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >
            <div onClick={()=>toggle(todo.id)} style={{width:18, height:18, borderRadius:3, flexShrink:0, cursor:"pointer", border:todo.done?"none":`2px solid ${theme.border}`, background:todo.done?theme.success:"transparent", display:"flex", alignItems:"center", justifyContent:"center"}}>
              {todo.done && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{flex:1, fontSize:13, color:todo.done?theme.muted:theme.text, textDecoration:todo.done?"line-through":"none", cursor:"pointer"}} onClick={()=>toggle(todo.id)}>{todo.text}</span>
            <svg onClick={()=>remove(todo.id)} width="15" height="15" viewBox="0 0 24 24" fill={theme.border} style={{cursor:"pointer", flexShrink:0}}
              onMouseEnter={e=>e.target.setAttribute("fill","#ea4335")}
              onMouseLeave={e=>e.target.setAttribute("fill",theme.border)}
            ><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </div>
        ))}
      </div>
      <div style={{display:"flex", gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="새 할 일 추가..."
          className="dashboard-input"
          style={{flex:1, minHeight:40, padding:"0 13px", borderRadius:10, fontSize:13, fontFamily:"inherit", border:focused?`1px solid ${theme.accentColor}`:`1px solid ${theme.border}`, outline:"none", color:theme.text, background:theme.surfaceAlt}}
        />
        <button onClick={add} style={{minHeight:40, padding:"0 16px", borderRadius:10, border:"none", background:theme.accentColor, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit"}}
          onMouseEnter={e=>e.target.style.opacity="0.88"} onMouseLeave={e=>e.target.style.opacity="1"}
        >추가</button>
      </div>
    </div>
  );
}

/* ── NEWS ── */
const CATEGORIES = [
  { id:"all", label:"전체", query:"기술 OR 소프트웨어 OR 반도체" },
  { id:"ai", label:" AI", query:"인공지능 OR 생성형 AI OR 오픈AI" },
  { id:"sec", label:" 보안", query:"사이버보안 OR 해킹 OR 랜섬웨어" },
  { id:"mobile", label:" 모바일", query:"스마트폰 OR 모바일 앱 OR 안드로이드 OR 아이폰" },
  { id:"startup", label:" 스타트업", query:"스타트업 OR 벤처투자 OR 기술 창업" },
  { id:"ev", label:" EV·로봇", query:"전기차 OR 로봇 OR 자율주행" },
];

function NewsCard({ theme }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState("all");
  const [err, setErr] = useState(null);

  const fetchNews = useCallback(async (categoryId, signal) => {
    setLoading(true);
    setErr(null);
    setNews([]);
    const q = CATEGORIES.find(c=>c.id===categoryId)?.query || CATEGORIES[0].query;

    try {
      const items = await fetchLatestNews(q, { signal });
      setNews(items);
      if (items.length === 0) {
        setErr("최근 48시간 내 관련 뉴스를 찾지 못했습니다.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setErr(error.message || "뉴스를 불러오지 못했습니다.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      fetchNews("all", controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchNews]);

  const handleCat = (id) => { setCat(id); fetchNews(id); };
  const colors = [theme.accentColor,"#EA4335","#FBBC05",theme.success,theme.accentColor];

  return (
    <div className="dashboard-card" style={getCardStyle(theme)}>
      {/* Header */}
      <div style={{...getCardTitleStyle(theme), justifyContent:"space-between"}}>
        <span style={{display:"flex", alignItems:"center", gap:8}}><span style={{fontSize:16}}>📰</span> 최신 기술 뉴스</span>
        <button onClick={()=>fetchNews(cat)} disabled={loading} style={{fontSize:11, padding:"5px 11px", borderRadius:999, border:`1px solid ${theme.border}`, background:theme.surfaceAlt, cursor:"pointer", color:theme.accentColor, fontWeight:700, fontFamily:"inherit"}}>
          {loading?"로딩 중...":"↻ 새로고침"}
        </button>
      </div>

      {/* Category filter */}
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:14}}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={()=>handleCat(c.id)} style={{
            padding:"6px 12px", borderRadius:999, fontSize:11, fontWeight:700,
            border: cat===c.id ? "none" : `1px solid ${theme.border}`,
            background: cat===c.id ? theme.accentColor : theme.surface,
            color: cat===c.id ? "#fff" : theme.subText,
            cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s"
          }}>{c.label}</button>
        ))}
      </div>

      {/* News list */}
      {loading && (
        <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, padding:"20px 0", color:theme.muted}}>
          <div style={{display:"flex", gap:6}}>
            {[theme.accentColor,"#EA4335","#FBBC05",theme.success].map((c,i)=>(
              <div key={i} style={{width:8, height:8, borderRadius:"50%", background:c, animation:`bounce 1s ${i*0.15}s infinite`}}/>
            ))}
          </div>
          <div style={{fontSize:12}}>뉴스를 가져오는 중...</div>
          <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
        </div>
      )}
      {!loading && (
        <div style={{flex:1, overflowY:"auto"}}>
          {err && <div style={{color:theme.danger, fontSize:13, padding:"12px 4px"}}>{err}</div>}
          {news.map((item,i) => (
            <a key={i} href={item.url||"#"} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none", display:"block"}}>
              <div style={{display:"flex", gap:12, padding:"11px 6px", borderRadius:10, borderBottom:i<news.length-1?`1px solid ${theme.divider}`:"none"}}
                onMouseEnter={e=>e.currentTarget.style.background=theme.surfaceAlt}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <div style={{width:4, borderRadius:999, background:colors[i%5], opacity:0.88, flexShrink:0, alignSelf:"stretch", minHeight:40}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13, fontWeight:700, color:theme.accentColor, marginBottom:3, lineHeight:1.5}}>{item.title}</div>
                  <div style={{fontSize:11, color:theme.subText, lineHeight:1.55}}>{item.summary}</div>
                  {item.source && <div style={{fontSize:10, color:theme.muted, marginTop:2}}>{item.source}</div>}
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
function SearchBar({ theme }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const search = e => {
    if (!q.trim()) return;
    window.open(e==="google"?`https://www.google.com/search?q=${encodeURIComponent(q)}`:`https://search.naver.com/search.naver?query=${encodeURIComponent(q)}`,"_blank");
  };
  return (
    <div style={{width:"100%", maxWidth:584, margin:"0 auto"}}>
      <div style={{display:"flex", alignItems:"center", border:focused?`1px solid ${theme.accentColor}`:`1px solid ${theme.border}`, borderRadius:999, padding:"11px 17px", boxShadow:focused?`0 4px 18px ${theme.accentColor}33`:"0 2px 10px rgba(32,33,36,.08)", background:theme.surface, gap:10}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke={theme.muted} strokeWidth="2" strokeLinecap="round"/></svg>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search("google")}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="Google 검색 또는 URL 입력"
          className="dashboard-input"
          style={{flex:1, border:"none", outline:"none", fontSize:16, color:theme.text, background:"transparent"}}
        />
        {q && <svg onClick={()=>setQ("")} width="18" height="18" viewBox="0 0 24 24" fill={theme.muted} style={{cursor:"pointer"}}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>}
        <div style={{width:1, height:24, background:theme.divider}}/>
        <svg onClick={()=>search("google")} width="24" height="24" viewBox="0 0 48 48" style={{cursor:"pointer", flexShrink:0}}>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
      </div>
      <div style={{display:"flex", justifyContent:"center", gap:10, marginTop:16}}>
        {["Google 검색","Naver 검색"].map((label,i)=>(
          <button key={i} onClick={()=>search(i===0?"google":"naver")} style={{padding:"9px 20px", borderRadius:10, border:`1px solid ${theme.surfaceAlt}`, background:theme.surfaceAlt, color:theme.text, fontSize:14, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 1px 1px rgba(0,0,0,.1)"}}
            onMouseEnter={e=>{e.target.style.border=`1px solid ${theme.border}`; e.target.style.boxShadow="0 1px 3px rgba(0,0,0,.2)";}}
            onMouseLeave={e=>{e.target.style.border=`1px solid ${theme.surfaceAlt}`; e.target.style.boxShadow="0 1px 1px rgba(0,0,0,.1)";}}
          >{label}</button>
        ))}
      </div>
    </div>
  );
}

/* ── APP ── */
export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("dashboard-mode") || "light");
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem("dashboard-accent-color") || "#4285F4");

  const theme = useMemo(() => ({
    mode,
    accentColor,
    pageBg: mode === "dark" ? "#202124" : "#f8f9fa",
    surface: mode === "dark" ? "#303134" : "#ffffff",
    surfaceAlt: mode === "dark" ? "#3c4043" : "#f8f9fa",
    text: mode === "dark" ? "#e8eaed" : "#202124",
    subText: mode === "dark" ? "#bdc1c6" : "#5f6368",
    muted: "#9aa0a6",
    border: mode === "dark" ? "#5f6368" : "#dadce0",
    divider: mode === "dark" ? "#5f6368" : "#e8eaed",
    danger: "#d93025",
    success: "#34A853",
    footerBg: mode === "dark" ? "#171717" : "#f2f2f2",
  }), [mode, accentColor]);

  useEffect(() => {
    localStorage.setItem("dashboard-mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("dashboard-accent-color", accentColor);
  }, [accentColor]);

  useEffect(() => {
    document.title = "My Google - 사용자 맞춤형 대시보드";
  }, []);

  const logoColors = ["#4285F4","#EA4335","#FBBC05","#4285F4","#34A853","#EA4335"];
  const topControlStyle = {
    minHeight: 34,
    padding: "0 12px",
    borderRadius: 999,
    border: `1px solid ${theme.border}`,
    background: theme.surfaceAlt,
    color: theme.text,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <div style={{minHeight:"100vh", background:theme.pageBg, color:theme.text, fontFamily:"'Google Sans',Roboto,Arial,sans-serif", display:"flex", flexDirection:"column"}}>
      <style>{`
        .dashboard-input::placeholder{color:${theme.muted};opacity:1}
        .dashboard-card:hover{
          transform:translateY(-2px);
          box-shadow:${theme.mode === "dark" ? "0 8px 20px rgba(0,0,0,.35)" : "0 8px 20px rgba(32,33,36,.14)"} !important;
        }
        .top-link,.top-control{transition:background 0.18s ease,border-color 0.18s ease,opacity 0.18s ease}
        .top-link:hover,.top-control:hover{background:${theme.surfaceAlt};opacity:.92}
        @media (max-width:768px){
          .dashboard-grid{grid-template-columns:1fr !important}
          .dashboard-shell{padding:0 12px !important;margin:18px auto !important}
          .dashboard-card{min-height:auto !important;padding:18px !important}
          .dashboard-hero{padding-top:26px !important;padding-bottom:24px !important}
          .dashboard-logo{font-size:46px !important}
          .topbar{padding:12px !important;gap:8px !important;flex-wrap:wrap}
        }
      `}</style>
      <div className="topbar" style={{display:"flex", justifyContent:"flex-end", alignItems:"center", padding:"14px 24px", gap:12, background:theme.surface, borderBottom:`1px solid ${theme.divider}`}}>
        <a className="top-link" href="https://mail.google.com" target="_blank" rel="noopener noreferrer" style={{fontSize:13, color:theme.text, textDecoration:"none", padding:"7px 9px", borderRadius:999}}>Gmail</a>
        <a className="top-link" href="https://www.google.com/imghp" target="_blank" rel="noopener noreferrer" style={{fontSize:13, color:theme.text, textDecoration:"none", padding:"7px 9px", borderRadius:999}}>이미지</a>
        <button
          className="top-control"
          onClick={() => setMode(prev => prev === "light" ? "dark" : "light")}
          aria-label="다크모드와 라이트모드 전환"
          title="다크모드와 라이트모드 전환"
          style={{...topControlStyle, borderColor:`${theme.accentColor}66`}}
        >
          {mode === "light" ? "🌙 다크" : "☀️ 라이트"}
        </button>
        <label
          className="top-control"
          title="나만의 색상 선택"
          style={{...topControlStyle, borderColor:`${theme.accentColor}66`}}
        >
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            aria-label="나만의 색상 선택"
            style={{width:18, height:18, padding:0, border:"none", borderRadius:4, background:"transparent", cursor:"pointer"}}
          />
          색상
        </label>
        <div style={{width:36, height:36, borderRadius:"50%", background:theme.accentColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:500, cursor:"pointer"}}>나</div>
      </div>

      <div className="dashboard-hero" style={{background:theme.surface, paddingTop:32, paddingBottom:26, display:"flex", flexDirection:"column", alignItems:"center", borderBottom:`1px solid ${theme.divider}`}}>
        <div className="dashboard-logo" style={{fontSize:62, fontWeight:300, letterSpacing:0, marginBottom:8, lineHeight:1}}>
          {"My Google".split("").map((ch,i)=>{
            const c = ch === " " ? "transparent" : logoColors[i % logoColors.length];
            return <span key={i} style={{color:c}}>{ch === " " ? "\u00a0" : ch}</span>;
          })}
        </div>
        <div style={{fontSize:15, color:theme.text, fontWeight:600, marginBottom:4}}>나만의 검색 대시보드</div>
        <div style={{fontSize:13, color:theme.subText, marginBottom:18}}>시간, 날씨, 할 일, 뉴스를 한 화면에서 확인하세요.</div>
        <SearchBar theme={theme} />
      </div>

      <div className="dashboard-shell" style={{flex:1, width:"100%", maxWidth:1200, margin:"24px auto", padding:"0 24px", boxSizing:"border-box"}}>
        <div className="dashboard-grid" style={{display:"grid", gridTemplateColumns:"repeat(2, minmax(320px, 1fr))", gap:20, justifyContent:"center", alignItems:"stretch"}}>
          <ClockCard theme={theme} />
          <TodoCard theme={theme} />
          <WeatherCard theme={theme} />
          <NewsCard theme={theme} />
        </div>
      </div>

      <div style={{borderTop:`1px solid ${theme.divider}`, background:theme.footerBg, padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, fontSize:13, color:theme.subText}}>
        <span>대한민국</span>
        <div style={{display:"flex", gap:20}}>
          <span style={{cursor:"pointer"}}>개인정보처리방침</span>
          <span style={{cursor:"pointer"}}>설정</span>
        </div>
      </div>
    </div>
  );
}
