import { useEffect, useRef, useState } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { Check, Languages, Menu, Moon, Sun, X } from "lucide-react";
import { LANGUAGES } from "../constants";
import logo from "../assets/logo.webp";
import PillNav from "./react-bits/PillNav";

export default function Navbar({ classNavbar = "bg-transparent", changeTheme, theme, changeLanguage, lang = "en" }) {
  const { i18n, t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const controlsRef = useRef(null);
  const isHome = window.location.pathname === "/";
  const isDark = theme === "Dark";
  const compact = !classNavbar.includes("bg-transparent");

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target)) setControlsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setControlsOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const selectLanguage = async (code) => {
    localStorage.setItem("i18nextLng", code);
    await i18n.changeLanguage(code);
    await changeLanguage(code);
    setControlsOpen(false);
    setMobileOpen(false);
  };

  const toggleTheme = async () => {
    await changeTheme(isDark ? "Light" : "Dark");
    setControlsOpen(false);
  };

  const goHome = () => {
    if (!isHome) window.location.href = "/";
    else scroll.scrollToTop();
    setMobileOpen(false);
  };

  const navClass = "nav-link";
  const homeLinks = [
    { to: "stack", label: t("stack") },
    { to: "portfolio", label: t("portfolio") },
    { to: "contact", label: t("contact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50" role="banner">
      <div className={`mx-auto px-3 transition-all duration-300 sm:px-5 ${compact ? "max-w-6xl pt-3" : "max-w-7xl pt-4"}`}>
        <PillNav className="w-full justify-between !px-2.5 !py-2 sm:!px-3">
          <button onClick={goHome} className="group flex items-center gap-2 rounded-full pr-2" aria-label="Ardhi Rahmaan, go to home">
            <img className="h-9 w-9 rounded-full object-contain transition-transform group-hover:rotate-[-6deg]" src={logo} alt="" />
            <span className="hidden font-display text-xs font-semibold tracking-tight text-slate-900 dark:text-cloud sm:block">Ardhi Rahmaan</span>
          </button>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
            <button onClick={goHome} className={navClass}>{t("home")}</button>
            {isHome ? homeLinks.map((item) => (
              <Link key={item.to} to={item.to} smooth spy offset={-72} activeClass="nav-link-active" className={navClass}>{item.label}</Link>
            )) : null}
            <a href="/blog" className={`${navClass} ${window.location.pathname.startsWith("/blog") ? "nav-link-active" : ""}`}>Blog</a>
          </nav>

          <div className="flex items-center gap-1.5">
            <div ref={controlsRef} className="relative hidden lg:block">
              <button onClick={() => setControlsOpen((open) => !open)} className="flex h-9 items-center gap-2 rounded-full bg-slate-100/80 px-3 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15" aria-label="Language and appearance" aria-expanded={controlsOpen}>
                <Languages className="h-3.5 w-3.5" />{lang}
              </button>
              {controlsOpen ? (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-panel/95">
                  <p className="px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-slate-400">Language</p>
                  {LANGUAGES.map(({ code, label }) => (
                    <button key={code} onClick={() => selectLanguage(code)} className="menu-option">
                      {label}{lang.startsWith(code) ? <Check className="ml-auto h-3.5 w-3.5 text-primary" /> : null}
                    </button>
                  ))}
                  <div className="my-2 h-px bg-slate-200 dark:bg-white/10" />
                  <button onClick={toggleTheme} className="menu-option">
                    {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-primary" />}{isDark ? "Light mode" : "Dark mode"}
                  </button>
                </div>
              ) : null}
            </div>
            <button onClick={() => setMobileOpen(true)} className="icon-action !h-9 !w-9 lg:hidden" aria-label="Open menu" aria-expanded={mobileOpen}><Menu className="h-4 w-4" /></button>
          </div>
        </PillNav>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button className="absolute inset-0 bg-void/45 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col bg-white p-6 shadow-2xl dark:bg-void">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-semibold text-slate-900 dark:text-cloud">Navigate</p>
              <button onClick={() => setMobileOpen(false)} className="icon-action" aria-label="Close menu"><X className="h-4 w-4" /></button>
            </div>
            <nav className="mt-12 flex flex-col" aria-label="Mobile navigation">
              <button onClick={goHome} className="mobile-nav-link">{t("home")}</button>
              {isHome ? homeLinks.map((item) => <Link key={item.to} to={item.to} smooth offset={-64} onClick={() => setMobileOpen(false)} className="mobile-nav-link">{item.label}</Link>) : null}
              <a href="/blog" className="mobile-nav-link">Blog</a>
            </nav>
            <div className="mt-auto space-y-5 border-t border-slate-200 pt-6 dark:border-white/10">
              <div className="flex gap-2">
                {LANGUAGES.map(({ code }) => <button key={code} onClick={() => selectLanguage(code)} className={`rounded-full px-4 py-2 font-mono text-xs font-medium uppercase ${lang.startsWith(code) ? "bg-primary text-primary-contrast" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>{code}</button>)}
              </div>
              <button onClick={toggleTheme} className="secondary-action w-full justify-center">{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{isDark ? "Light mode" : "Dark mode"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
