import { useState } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import { LANGUAGES, themes } from "../constants";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.webp";
import { SunDim, SunMoon, X, Menu } from "lucide-react";
import PillNav from "./react-bits/PillNav";

const Navbar = (props) => {
  const { i18n, t } = useTranslation();
  const [stateOffCanvas, setStateOffCanvas] = useState(false);
  const [stateLangDropdown, setStateLangDropdown] = useState(false);
  const [stateThemeDropdown, setStateThemeDropdown] = useState(false);
  const [stateLangOffCanvas, setStateLangOffCanvas] = useState(false);

  const changeLanguage = async (_lang) => {
    await i18n.changeLanguage(_lang);
    await props.changeLanguage(_lang);
  };

  const changeTheme = async (_theme) => {
    await props.changeTheme(_theme);
  };

  const toggleOffCanvas = () => setStateOffCanvas((open) => !open);

  const handleScrollTop = () => {
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    } else {
      scroll.scrollToTop();
    }
  };

  const toggleLangDropdown = () => {
    setStateLangDropdown((open) => !open);
    setStateThemeDropdown(false);
  };

  const toggleThemeDropdown = () => {
    setStateThemeDropdown((open) => !open);
    setStateLangDropdown(false);
  };

  const handleSelectLanguage = async (code, isOffCanvas = false) => {
    localStorage.setItem("i18nextLng", code);
    setStateLangDropdown(false);
    if (isOffCanvas) {
      setStateLangOffCanvas(false);
      setStateOffCanvas(false);
    }
    await changeLanguage(code);
  };

  const handleSelectTheme = async (label, closeOffCanvas = false) => {
    setStateThemeDropdown(false);
    if (closeOffCanvas) setStateOffCanvas(false);
    await changeTheme(label);
  };

  const handleToggleMobileTheme = async () => {
    const nextTheme = props.theme === "Dark" ? "Light" : "Dark";
    await handleSelectTheme(nextTheme, true);
  };

  const navLinkClass =
    "cursor-pointer font-body text-sm font-semibold leading-6 text-slate-700 transition-colors duration-200 hover:text-electric dark:text-slate-200 dark:hover:text-ion px-3 py-1.5 rounded-full hover:bg-electric/10 dark:hover:bg-ion/10";

  const mobileItemClass =
    "-mx-3 block cursor-pointer rounded-xl px-3 py-2.5 font-body text-base font-semibold leading-7 text-slate-800 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10";

  return (
    <header role="banner" className="fixed inset-x-0 top-0 z-50">
      <div className={`mx-auto px-4 transition-all duration-300 ${props.classNavbar.includes("bg-transparent") ? "pt-4 max-w-7xl" : "pt-3 max-w-6xl"}`}>
        <PillNav className="w-full justify-between">
          {/* Logo */}
          <button
            onClick={handleScrollTop}
            className="cursor-pointer p-1 -m-1 rounded-full focus-visible:ring-2 focus-visible:ring-ion"
            aria-label="Go to top"
          >
            <img
              fetchpriority="high"
              className="h-10 w-auto dark:grayscale hover:dark:grayscale-0 transition-all duration-300"
              src={logo}
              alt="logo"
            />
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            <div onClick={handleScrollTop} className={navLinkClass}>{t("home")}</div>
            {window.location.pathname === "/" && (
              <>
                <Link smooth to="stack" className={navLinkClass}>Stack</Link>
                <Link smooth to="portfolio" className={navLinkClass}>{t("portfolio")}</Link>
                <Link smooth to="contact" className={navLinkClass}>{t("contact")}</Link>
              </>
            )}
            <a href="/blog" className={navLinkClass}>Blog</a>
          </div>

          {/* Desktop controls */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {/* Language picker */}
            <div className="relative">
              <button
                onClick={toggleLangDropdown}
                className="inline-flex h-8 min-w-12 items-center justify-center rounded-full bg-slate-100/80 px-3 font-mono text-xs font-semibold uppercase text-electric transition hover:bg-slate-200 dark:bg-white/10 dark:text-ion dark:hover:bg-white/20"
                aria-label="Language selector"
                aria-expanded={stateLangDropdown}
              >
                {props.lang.toUpperCase()}
              </button>
              {stateLangDropdown && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-white/10 bg-white/90 py-1 shadow-xl backdrop-blur-xl dark:bg-panel/90">
                  {LANGUAGES.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => handleSelectLanguage(code)}
                      className="block w-full px-4 py-2 text-left font-body text-sm font-semibold text-slate-800 hover:text-electric dark:text-slate-200 dark:hover:text-ion hover:bg-slate-50 dark:hover:bg-white/10 transition"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <div className="relative">
              <button
                onClick={toggleThemeDropdown}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 text-amber-500 transition hover:bg-slate-200 dark:bg-white/10 dark:text-ion dark:hover:bg-white/20"
                aria-label="Toggle theme"
                aria-expanded={stateThemeDropdown}
              >
                {props.theme === "Dark" ? <SunMoon className="h-4 w-4" /> : <SunDim className="h-4 w-4" />}
              </button>
              {stateThemeDropdown && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-white/10 bg-white/90 py-1 shadow-xl backdrop-blur-xl dark:bg-panel/90">
                  {themes.map(({ icon, label }) => (
                    <button
                      key={label}
                      onClick={() => handleSelectTheme(label)}
                      className="flex w-full items-center gap-2 px-4 py-2 font-body text-sm font-semibold text-slate-800 hover:text-electric dark:text-slate-200 dark:hover:text-ion hover:bg-slate-50 dark:hover:bg-white/10 transition"
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleOffCanvas}
            type="button"
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </PillNav>
      </div>

      {/* Mobile off-canvas */}
      {stateOffCanvas && (
        <div id="offcanvas-menu" className="lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={toggleOffCanvas} />
          <div className="fixed inset-y-0 right-0 z-50 w-72 overflow-y-auto bg-white/95 px-6 py-6 shadow-2xl backdrop-blur-xl dark:bg-void/95">
            <div className="flex items-center justify-between mb-8">
              <img className="h-8 w-auto dark:grayscale" src={logo} alt="logo" />
              <button
                onClick={toggleOffCanvas}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => { handleScrollTop(); setStateOffCanvas(false); }}
                className={mobileItemClass}
              >
                {t("home")}
              </button>
              {window.location.pathname === "/" && (
                <>
                  <Link to="stack" smooth className={mobileItemClass} onClick={toggleOffCanvas}>Stack</Link>
                  <Link to="portfolio" smooth className={mobileItemClass} onClick={toggleOffCanvas}>{t("portfolio")}</Link>
                  <Link to="contact" smooth className={mobileItemClass} onClick={toggleOffCanvas}>{t("contact")}</Link>
                </>
              )}
              <a href="/blog" className={mobileItemClass}>Blog</a>

              {/* Theme toggle */}
              <button
                onClick={handleToggleMobileTheme}
                className="-mx-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 font-body text-base font-semibold leading-7 text-slate-800 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {props.theme === "Dark" ? <SunMoon className="h-5 w-5" /> : <SunDim className="h-5 w-5" />}
                {props.theme ?? "Light"} mode
              </button>
            </nav>

            {/* Language section */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setStateLangOffCanvas((o) => !o)}
                className="w-full rounded-xl bg-slate-100/80 py-2.5 font-mono text-sm font-semibold uppercase tracking-widest text-electric transition hover:bg-slate-200 dark:bg-white/10 dark:text-ion dark:hover:bg-white/20"
              >
                {props.lang.toUpperCase()}
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${stateLangOffCanvas ? "max-h-32 mt-2" : "max-h-0"}`}>
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => handleSelectLanguage(code, true)}
                    className="block w-full px-4 py-2 text-left font-body text-sm text-slate-600 transition hover:text-electric dark:text-slate-300 dark:hover:text-ion hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
