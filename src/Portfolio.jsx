import React, { useState, useEffect, useRef, useCallback } from "react";
import meImg from "./assets/me.jpeg";

/* ════════════════════════════════════════════════════════════════
   AKSHATH TOGARI — PORTFOLIO (v7)
   Order: hero → details (photo + bio + contact) → skills → projects
          → stats/accuracy → experience → footer
   Warm near-black base · champagne-gold accent
   Display: Fraunces · Body: Inter · Meta: Space Mono
   ════════════════════════════════════════════════════════════════ */

const THEMES = {
  dark: {
    "--bg": "#0E0C0A", "--surface": "rgba(26,22,17,0.66)", "--surface-solid": "#16130F",
    "--text": "#EDE8E0", "--muted": "#9A9286", "--faint": "#5E574C",
    "--line": "rgba(201,168,106,0.16)", "--accent": "#C9A86A", "--accent-soft": "rgba(201,168,106,0.10)",
    "--accent-ink": "#0E0C0A",
    "--glow1": "rgba(201,168,106,0.16)", "--glow2": "rgba(150,120,70,0.12)",
  },
  light: {
    "--bg": "#F2EEE6", "--surface": "rgba(255,255,255,0.70)", "--surface-solid": "#FBF8F2",
    "--text": "#1B1813", "--muted": "#6B6356", "--faint": "#A39B8C",
    "--line": "rgba(150,120,70,0.20)", "--accent": "#9A7B3C", "--accent-soft": "rgba(154,123,60,0.08)",
    "--accent-ink": "#FFFFFF",
    "--glow1": "rgba(201,168,106,0.20)", "--glow2": "rgba(180,150,90,0.14)",
  },
};

function useFonts() {
  useEffect(() => {
    if (document.getElementById("ak-fonts")) return;
    const l = document.createElement("link");
    l.id = "ak-fonts";
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500&family=Space+Mono:wght@400&display=swap";
    document.head.appendChild(l);
  }, []);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = () => setReduced(m.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);
  return reduced;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); o.disconnect(); } }, { threshold });
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* slow, smooth fade-rise */
function Reveal({ children, delay = 0, y = 24, as = "div", style, className }) {
  const [ref, inView] = useInView(0.14);
  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={{ ...style, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : `translateY(${y}px)`, transition: `opacity 1.1s cubic-bezier(.22,.7,.2,1) ${delay}s, transform 1.1s cubic-bezier(.22,.7,.2,1) ${delay}s` }}>
      {children}
    </Tag>
  );
}

function useCountUp(target, start, reduced, dur = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduced) { setVal(target); return; }
    let raf; const t0 = performance.now();
    const tick = (t) => { const p = Math.min((t - t0) / dur, 1); setVal(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); else setVal(target); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, dur, reduced]);
  return val;
}

function Eyebrow({ children }) {
  return (
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--accent)", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 28, height: 1, background: "var(--accent)", display: "inline-block", opacity: 0.7 }} />{children}
    </div>
  );
}

function Tag({ children, onLight }) {
  return <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11.5, letterSpacing: "0.04em", color: onLight ? "rgba(237,232,224,0.9)" : "var(--muted)", border: `1px solid ${onLight ? "rgba(201,168,106,0.35)" : "var(--line)"}`, borderRadius: 2, padding: "5px 11px" }}>{children}</span>;
}

/* ════════ device-screen video that plays only when in view ════════ */
function ScreenVideo({ src, poster, style }) {
  const ref = useRef(null);
  const [vRef, inView] = useInView(0.25);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    if (inView) { v.play?.().catch(() => {}); } else { v.pause?.(); }
  }, [inView]);
  return (
    <div ref={vRef} style={{ width: "100%", height: "100%" }}>
      <video ref={ref} loop muted playsInline poster={poster} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

/* Laptop frame */
function Laptop({ src, poster }) {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <div style={{ background: "#1A1714", border: "1px solid rgba(201,168,106,0.3)", borderRadius: "12px 12px 4px 4px", padding: 10, boxShadow: "0 40px 80px -40px rgba(0,0,0,0.8)" }}>
        <div style={{ borderRadius: 5, overflow: "hidden", aspectRatio: "16 / 10", background: "#000" }}>
          <ScreenVideo src={src} poster={poster} />
        </div>
      </div>
      <div style={{ height: 13, background: "linear-gradient(to bottom, #2A2420, #15110E)", borderRadius: "0 0 10px 10px", margin: "0 auto", width: "112%", marginLeft: "-6%", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 70, height: 4, background: "#0A0806", borderRadius: "0 0 5px 5px" }} />
      </div>
    </div>
  );
}

/* Phone frame */
function Phone({ src, poster }) {
  return (
    <div style={{ width: "clamp(120px, 22vw, 168px)" }}>
      <div style={{ background: "#1A1714", border: "1px solid rgba(201,168,106,0.32)", borderRadius: 26, padding: 7, boxShadow: "0 40px 70px -30px rgba(0,0,0,0.85)" }}>
        <div style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "9 / 19.5", background: "#000", position: "relative" }}>
          <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 42, height: 13, background: "#0A0806", borderRadius: 10, zIndex: 3 }} />
          <ScreenVideo src={src} poster={poster} />
        </div>
      </div>
    </div>
  );
}

/* ════════ Project showcase — bg clip + devices, alternating ════════ */
function ProjectShowcase({ project, index, reduced }) {
  const [ref, inView] = useInView(0.2);
  const flipped = index % 2 === 1;

  const devicesEnter = {
    opacity: inView ? 1 : 0,
    transform: inView
      ? "perspective(1400px) rotateY(0deg) rotateX(0deg) translateY(0)"
      : `perspective(1400px) rotateY(${flipped ? -10 : 10}deg) rotateX(6deg) translateY(40px)`,
    transition: "opacity 1.2s cubic-bezier(.22,.7,.2,1), transform 1.4s cubic-bezier(.22,.7,.2,1)",
  };
  const phoneEnter = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
    transition: "opacity 1.2s cubic-bezier(.22,.7,.2,1) .25s, transform 1.4s cubic-bezier(.22,.7,.2,1) .25s",
  };

  return (
    <Reveal style={{ marginBottom: "clamp(2rem, 5vw, 3.5rem)" }} y={36}>
      <div ref={ref} className="ak-proj-card" style={{ position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid var(--line)", minHeight: "clamp(420px, 60vh, 560px)", display: "flex", alignItems: "center", boxShadow: "0 30px 70px -45px rgba(0,0,0,0.6)" }}>
        {/* animation clip background */}
        <video autoPlay loop muted playsInline poster={project.poster} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.8) brightness(0.55)", transform: !reduced && inView ? "scale(1.05)" : "scale(1)", transition: "transform 2s cubic-bezier(.2,.7,.2,1)" }}>
          <source src={project.bgVideo} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,8,6,0.92), rgba(10,8,6,0.55) 60%, rgba(10,8,6,0.35))" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(201,168,106,0.10), transparent 55%)" }} />

        {/* content grid */}
        <div className="ak-proj-grid" style={{ position: "relative", zIndex: 2, width: "100%", display: "grid", gridTemplateColumns: flipped ? "1.05fr 0.95fr" : "0.95fr 1.05fr", gap: "clamp(1.5rem, 3vw, 3rem)", alignItems: "center", padding: "clamp(1.75rem, 4vw, 3.5rem)" }}>
          {/* TEXT column */}
          <div className="ak-proj-text" style={{ order: flipped ? 2 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--accent)", letterSpacing: "0.1em" }}>{String(index + 1).padStart(2, "0")}</span>
              <span style={{ width: 18, height: 1, background: "rgba(201,168,106,0.5)" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(237,232,224,0.72)" }}>{project.kind}</span>
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", margin: "0 0 1rem 0", color: "#fff" }}>{project.name}</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(13px, 1.4vw, 14.5px)", fontWeight: 300, lineHeight: 1.7, color: "rgba(237,232,224,0.82)", maxWidth: 440, margin: "0 0 1.4rem 0" }}>{project.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: "1.4rem" }}>
              {project.highlights.map((h, i) => (
                <span key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(237,232,224,0.9)", display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />{h}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
              {project.tech.map((t) => (<Tag key={t} onLight>{t}</Tag>))}
            </div>
            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", borderBottom: "1px solid var(--accent)", paddingBottom: 4, textDecoration: "none" }}>view source <span>↗</span></a>
          </div>

          {/* DEVICES column */}
          <div className="ak-proj-devices" style={{ order: flipped ? 1 : 2, position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
            <div className="ak-laptop-wrap" style={{ ...devicesEnter, width: "100%", display: "flex", justifyContent: "center" }}>
              <Laptop src={project.desktopVideo} poster={project.poster} />
            </div>
            <div className="ak-phone-wrap ak-float" style={{ ...phoneEnter, position: "absolute", bottom: -10, right: flipped ? "auto" : "-4%", left: flipped ? "-4%" : "auto", zIndex: 3 }}>
              <Phone src={project.mobileVideo} poster={project.poster} />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Stat({ n, suffix, label, inView, reduced }) {
  const v = useCountUp(n, inView, reduced);
  return (
    <div style={{ padding: "0.5rem 0" }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--text)" }}>{Math.round(v)}<span style={{ color: "var(--accent)" }}>{suffix}</span></div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.08em", color: "var(--muted)", marginTop: 10 }}>{label}</div>
    </div>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle colour theme" style={{ width: 46, height: 46, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--surface)", backdropFilter: "blur(14px)", color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "transform .3s, border-color .3s" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}>
      {theme === "dark" ? "☾" : "☀"}
    </button>
  );
}

/* ════════════════════ DATA ════════════════════ */
const BIO = "I'm a full-stack developer based in Hyderabad. I build web apps end to end, from the database and backend to the interface, mostly with React, Next.js, and Node. I've also worked on a few projects using NLP and language models, including a multilingual legal assistant and a chatbot for ordering food.";

const CONTACT = {
  email: "akshth.togari05@gmail.com",
  phone: "+91 7569534271",
  linkedin: "https://linkedin.com/in/akshath-togari",
  github: "https://github.com/Akshath2901",
};

/* Each project: bgVideo = ambient animation clip behind the card.
   desktopVideo / mobileVideo = your real screen recordings (swap these
   placeholders for /recordings/<name>-desktop.mp4 etc. when ready). */
const PROJECTS = [
  { name: "Aureve-Structa", kind: "Real estate · construction",
    bgVideo: "https://assets.mixkit.co/videos/4010/4010-720.mp4",
    poster: "https://assets.mixkit.co/videos/4010/4010-thumb-720-0.jpg",
    desktopVideo: "/recordings/aureve-desktop.mp4",
    mobileVideo: "/recordings/aureve-mobile.mp4",
    description: "A real estate and construction platform built as one monorepo with two Next.js apps that share a single PostgreSQL database. It has separate logins and dashboards for buyers, sellers, admins, and staff.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Monorepo", "RBAC"],
    highlights: ["Four user roles", "Two linked Next.js apps", "Shared database"],
    link: "https://github.com/Akshath2901" },
  { name: "BlueBliss", kind: "Cloud kitchen platform",
    bgVideo: "https://assets.mixkit.co/videos/13875/13875-720.mp4",
    poster: "https://assets.mixkit.co/videos/13875/13875-thumb-720-0.jpg",
    desktopVideo: "/recordings/bluebliss-desktop.mp4",
    mobileVideo: "/recordings/bluebliss-mobile.mp4",
    description: "A cloud kitchen platform built with the MERN stack. It has three types of users: customers who place orders, staff who manage inventory, and an admin who sees the analytics. It also has a chatbot that helps customers with recommendations and order questions.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "LLM"],
    highlights: ["Customer, staff & admin views", "Chatbot for orders", "MERN stack"],
    link: "https://github.com/Akshath2901" },
  { name: "BlueBliss Inventory", kind: "Cloud-kitchen inventory & HR",
    bgVideo: "https://assets.mixkit.co/videos/13875/13875-720.mp4",
    poster: "https://assets.mixkit.co/videos/13875/13875-thumb-720-0.jpg",
    desktopVideo: "https://assets.mixkit.co/videos/13875/13875-720.mp4",
    mobileVideo: "https://assets.mixkit.co/videos/13875/13875-720.mp4",
    description: "An inventory and operations tool for a cloud kitchen's staff. It handles stock tracking, purchase orders, dish costing, and waste logging, along with HR features like payroll, attendance, and shift scheduling. The data is stored in Firebase Firestore.",
    tech: ["React", "Vite", "Firebase", "Firestore"],
    highlights: ["Live stock tracking", "Dish cost analysis", "Payroll & attendance"],
    link: "https://github.com/Akshath2901" },
  { name: "Nyaay-Sahaayak", kind: "Virtual legal assistant",
    bgVideo: "https://assets.mixkit.co/videos/47687/47687-720.mp4",
    poster: "https://assets.mixkit.co/videos/47687/47687-thumb-720-0.jpg",
    desktopVideo: "https://assets.mixkit.co/videos/47687/47687-720.mp4",
    mobileVideo: "https://assets.mixkit.co/videos/47687/47687-720.mp4",
    description: "A virtual legal assistant that answers common legal questions in several Indian languages. It uses NLP to understand the question and reply in the user's own language, with document lookup for people who aren't comfortable in English.",
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "NLP"],
    highlights: ["Several Indian languages", "NLP-based answers", "REST API backend"],
    link: "https://github.com/Akshath2901" },
  { name: "School Website", kind: "School · web platform",
    bgVideo: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4",
    poster: "https://images.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-0.jpg",
    desktopVideo: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4",
    mobileVideo: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4",
    description: "A responsive website for a school, covering admissions, announcements, a photo gallery, faculty details, and contact info. I set it up so staff can update the content without much trouble.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    highlights: ["Responsive design", "Admissions & info", "Easy to update"],
    link: "https://github.com/Akshath2901" },
];

const SKILLS = {
  Languages: ["Python", "JavaScript", "TypeScript"],
  "Full stack": ["Next.js", "React", "Node.js", "Express", "Tailwind", "REST", "Vercel"],
  Data: ["MongoDB", "PostgreSQL", "Firebase", "SQL"],
  "AI · GenAI": ["LLMs", "RAG", "LangChain", "OpenAI API", "PyTorch", "Hugging Face", "BERT"],
};
const STATS = [{ n: 96, suffix: "%", label: "NLP accuracy" }, { n: 9, suffix: "+", label: "languages" }, { n: 20, suffix: "+", label: "REST APIs built" }, { n: 5, suffix: "", label: "projects shipped" }];

/* nav follows the page order: details → skills → projects → contact */
const NAV = [["about", "about"], ["skills", "skills"], ["work", "work"], ["contact", "contact"]];

/* ════════════════════ MAIN ════════════════════ */
export default function Portfolio() {
  useFonts();
  const reduced = useReducedMotion();
  const [theme, setTheme] = useState("dark");
  const [heroIn, setHeroIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("about");
  const [statsRef, statsIn] = useInView(0.4);

  useEffect(() => { const t = setTimeout(() => setHeroIn(true), 200); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const onScroll = () => { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: "-45% 0px -45% 0px" });
    NAV.forEach(([, id]) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const vars = THEMES[theme];

  const heroLine = (txt, italic, delay) => (
    <span style={{ display: "block", overflow: "hidden" }}>
      <span style={{ display: "block", fontStyle: italic ? "italic" : "normal", fontWeight: italic ? 300 : 400, color: italic ? "var(--accent)" : "var(--text)", transform: heroIn ? "translateY(0)" : "translateY(105%)", transition: `transform 1.2s cubic-bezier(.2,.75,.2,1) ${delay}s` }}>{txt}</span>
    </span>
  );

  const contactItems = [
    ["email", CONTACT.email, `mailto:${CONTACT.email}`],
    ["phone", CONTACT.phone, `tel:${CONTACT.phone.replace(/\s/g, "")}`],
    ["linkedin", "akshath-togari", CONTACT.linkedin],
    ["github", "Akshath2901", CONTACT.github],
  ];

  return (
    <div style={{ ...vars, background: "var(--bg)", color: "var(--text)", minHeight: "100vh", fontFamily: "'Inter', sans-serif", transition: "background .6s ease, color .6s ease", position: "relative", overflowX: "hidden" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        ::selection { background: var(--accent); color: var(--accent-ink); }
        section { scroll-margin-top: 84px; }
        @keyframes ak-drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(5vw, 4vh) scale(1.1); } }
        @keyframes ak-drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-4vw, 5vh) scale(1.08); } }
        @keyframes ak-floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .ak-float { animation: ak-floaty 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .ak-float { animation: none; } }
        @media (max-width: 860px) {
          .ak-nav-links { display: none !important; }
          .ak-bio-grid { grid-template-columns: 1fr !important; }
          .ak-about-grid { grid-template-columns: 1fr !important; }
          .ak-proj-grid { grid-template-columns: 1fr !important; }
          .ak-proj-text { order: 1 !important; }
          .ak-proj-devices { order: 2 !important; flex-direction: column; gap: 1.5rem; }
          .ak-phone-wrap { position: static !important; left: auto !important; right: auto !important; bottom: auto !important; margin: 0 auto; }
          .ak-laptop-wrap { transform: none !important; }
          .ak-proj-card { min-height: 0 !important; }
        }
      `}</style>

      {/* ambient warm glow */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, var(--glow1), transparent 70%)", filter: "blur(100px)", animation: reduced ? "none" : "ak-drift1 32s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "45vw", height: "45vw", borderRadius: "50%", background: "radial-gradient(circle, var(--glow2), transparent 70%)", filter: "blur(120px)", animation: reduced ? "none" : "ak-drift2 38s ease-in-out infinite" }} />
      </div>

      <div style={{ position: "fixed", top: 0, left: 0, height: 2, width: `${progress}%`, background: "var(--accent)", zIndex: 200, transition: "width .1s linear" }} />
      <div style={{ position: "fixed", bottom: 26, right: 26, zIndex: 100 }}><ThemeToggle theme={theme} onToggle={toggle} /></div>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.3rem clamp(1.25rem, 5vw, 4rem)", background: "color-mix(in srgb, var(--bg) 72%, transparent)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--line)" }}>
        <a href="#top" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: 19, letterSpacing: "0.01em", color: "var(--text)", textDecoration: "none" }}>Akshath <span style={{ fontStyle: "italic", color: "var(--accent)" }}>Togari</span></a>
        <div className="ak-nav-links" style={{ display: "flex", gap: "2.2rem", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "0.08em" }}>
          {NAV.map(([label, id]) => (
            <a key={id} href={`#${id}`} style={{ color: active === id ? "var(--accent)" : "var(--muted)", textDecoration: "none", transition: "color .3s", position: "relative" }}>
              {label}<span style={{ position: "absolute", left: 0, bottom: -5, height: 1, width: active === id ? "100%" : "0%", background: "var(--accent)", transition: "width .4s" }} />
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <header id="top" style={{ position: "relative", zIndex: 2, padding: "clamp(4rem, 12vw, 9rem) clamp(1.25rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "clamp(3rem, 8vw, 5rem)", opacity: heroIn ? 1 : 0, transition: "opacity 1.2s .2s" }}>
          <span>Portfolio — 2026</span><span>Hyderabad, IN</span>
        </div>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(3.6rem, 15vw, 11rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.035em", margin: "0 0 2rem 0" }}>
          {heroLine("Akshath", false, 0)}
          {heroLine("Togari", true, 0.12)}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: heroIn ? 1 : 0, transition: "opacity 1.2s .5s" }}>
          <span style={{ width: "clamp(40px, 8vw, 90px)", height: 1, background: "var(--accent)", opacity: 0.6 }} />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(12px, 1.8vw, 15px)", letterSpacing: "0.1em", color: "var(--muted)", margin: 0 }}>full-stack developer &nbsp;·&nbsp; ai engineer</p>
        </div>
      </header>

      {/* ABOUT — photo + bio + contact details (moved to top) */}
      <section id="about" style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "clamp(2rem, 6vw, 4rem) auto 0", padding: "0 clamp(1.25rem, 5vw, 4rem)" }}>
        <Reveal style={{ marginBottom: "3rem" }}><Eyebrow>About</Eyebrow></Reveal>
        <div className="ak-bio-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "clamp(2rem, 5vw, 4.5rem)", alignItems: "center" }}>
          <Reveal>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: "14px -14px -14px 14px", border: "1px solid var(--accent)", opacity: 0.35, borderRadius: 4, zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 1, aspectRatio: "4 / 5", overflow: "hidden", borderRadius: 4, border: "1px solid var(--line)" }}>
                <img src={meImg} alt="Akshath Togari" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.95)" }} />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 3vw, 2.1rem)", fontWeight: 300, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "0 0 2rem 0", color: "var(--text)" }}>{BIO}</p>

            {/* contact details */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.75rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1.25rem" }}>
              {contactItems.map(([label, value, href]) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 7 }}>{label}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "var(--text)", wordBreak: "break-word" }}>{value}</div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "clamp(4rem, 10vw, 8rem) auto 0", padding: "0 clamp(1.25rem, 5vw, 4rem)" }}>
        <Reveal style={{ marginBottom: "2.5rem" }}>
          <Eyebrow>Skills</Eyebrow>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5.5vw, 3.5rem)", fontWeight: 400, letterSpacing: "-0.03em", margin: "1.2rem 0 0 0" }}>What I use.</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1px", background: "var(--line)", border: "1px solid var(--line)", borderRadius: 4, overflow: "hidden" }}>
          {Object.entries(SKILLS).map(([cat, items], i) => (
            <Reveal key={cat} delay={i * 0.08} style={{ padding: "1.75rem", background: "var(--surface)", backdropFilter: "blur(14px)" }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 19, fontWeight: 400, margin: "0 0 1.2rem 0", display: "flex", alignItems: "center", gap: 9, color: "var(--text)" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />{cat}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{items.map((s) => (<Tag key={s}>{s}</Tag>))}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WORK — projects */}
      <section id="work" style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "clamp(4rem, 10vw, 8rem) auto 0", padding: "0 clamp(1.25rem, 5vw, 4rem)" }}>
        <Reveal style={{ marginBottom: "2.5rem" }}>
          <Eyebrow>Projects</Eyebrow>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5.5vw, 3.5rem)", fontWeight: 400, letterSpacing: "-0.03em", margin: "1.2rem 0 0 0" }}>What I&apos;ve built.</h2>
        </Reveal>
        {PROJECTS.map((p, i) => (<ProjectShowcase key={p.name} project={p} index={i} reduced={reduced} />))}
      </section>

      {/* STATS — accuracy info */}
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "clamp(4rem, 10vw, 8rem) auto 0", padding: "0 clamp(1.25rem, 5vw, 4rem)" }}>
        <Reveal style={{ marginBottom: "2.5rem" }}>
          <Eyebrow>By the numbers</Eyebrow>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5.5vw, 3.5rem)", fontWeight: 400, letterSpacing: "-0.03em", margin: "1.2rem 0 0 0" }}>A few results.</h2>
        </Reveal>
        <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1.5rem 2.5rem", borderTop: "1px solid var(--line)", paddingTop: "2rem" }}>
          {STATS.map((s, i) => (<Stat key={i} {...s} inView={statsIn} reduced={reduced} />))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "clamp(4rem, 10vw, 8rem) auto 0", padding: "0 clamp(1.25rem, 5vw, 4rem)" }}>
        <Reveal style={{ marginBottom: "2.5rem" }}><Eyebrow>Experience</Eyebrow></Reveal>
        <Reveal className="ak-about-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.7fr)", gap: "clamp(1.5rem,4vw,3rem)", borderTop: "1px solid var(--line)", paddingTop: "2.25rem" }}>
          <div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--accent)", marginBottom: 6, letterSpacing: "0.06em" }}>Sep — Nov 2025</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--faint)" }}>Hyderabad, India</div></div>
          <div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 3.5vw, 2.1rem)", fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 0.5rem 0" }}>Software Development Intern</h3>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12.5, color: "var(--muted)", margin: "0 0 1.5rem 0" }}>Infosys Springboard — KnowMap (knowledge mapping)</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Built a knowledge-mapping system that links information across several domains, using NLP to pull out the key entities.",
                "Created 8+ REST APIs for moving through the knowledge graph, and finished the planned work in each sprint over a 3-month internship.",
                "Took part in scrum meetings with the team — sprint reviews and retrospectives — to keep the work on track."].map((t, i) => (
                <li key={i} style={{ display: "flex", gap: 14, padding: "1rem 0", borderBottom: "1px solid var(--line)", fontSize: 14.5, fontWeight: 300, lineHeight: 1.6 }}><span style={{ color: "var(--accent)", fontFamily: "'Space Mono', monospace", fontSize: 12 }}>0{i + 1}</span>{t}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* CONTACT — footer */}
      <section id="contact" style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "clamp(5rem, 12vw, 9rem) auto 0", padding: "clamp(3.5rem,8vw,6rem) clamp(1.25rem, 5vw, 4rem) clamp(2.5rem,5vw,4rem)", borderTop: "1px solid var(--line)" }}>
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.0, margin: "1.5rem 0 2.5rem 0" }}>Get in <span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--accent)" }}>touch.</span></h2>
          <a href={`mailto:${CONTACT.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "'Space Mono', monospace", fontSize: "clamp(13px, 2.2vw, 16px)", letterSpacing: "0.04em", color: "var(--accent-ink)", background: "var(--accent)", padding: "1.1rem 1.9rem", borderRadius: 3, textDecoration: "none", transition: "transform .3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>{CONTACT.email} <span>↗</span></a>
        </Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginTop: "clamp(3.5rem, 8vw, 5.5rem)", paddingTop: "1.75rem", borderTop: "1px solid var(--line)", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: "0.04em", color: "var(--muted)" }}>
          <span>© 2026 Akshath Togari</span>
          <div style={{ display: "flex", gap: "1.75rem" }}>
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>github</a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>linkedin</a>
            <span>{CONTACT.phone}</span>
          </div>
        </div>
      </section>
    </div>
  );
}