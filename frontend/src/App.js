import { useEffect, useState } from "react";
import i18n from "./i18n";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skill from "./components/Skill";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminSkills from "./components/admin/AdminSkills";
import AdminPortfolios from "./components/admin/AdminPortfolios";
import AdminMessages from "./components/admin/AdminMessages";
import AdminLocalizations from "./components/admin/AdminLocalizations";
import AdminEmployees from "./components/admin/AdminEmployees";
import AdminBlogs from "./components/admin/AdminBlogs";
import Blog from "./components/Blog";
import Maintenance from "./components/Maintenance";

function PublicApp({ theme, changeTheme, lang, changeLanguage }) {
  const [classNavbar, setClassNavbar] = useState("bg-transparent");

  useEffect(() => {
    const headerOffscreen = () => {
      if (window.pageYOffset > 25) {
        setClassNavbar("rounded-full bg-white dark:bg-slate-800 bg-opacity-40 backdrop-blur-2xl");
      } else {
        setClassNavbar("bg-transparent");
      }
    };
    window.addEventListener("scroll", headerOffscreen);
    return () => window.removeEventListener("scroll", headerOffscreen);
  }, []);

  const params = {
    classNavbar,
    changeTheme,
    theme,
    changeLanguage,
    lang,
  };

  return (
    <div className="select-none flex flex-col font-body">
      <Navbar {...params} />
      <main role="main">
        <Hero theme={theme} />
        <Skill {...params} />
        <Portfolio {...params} />
        <Contact {...params} />
      </main>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "Dark" ? "Dark" : "Light";
  });
  const [lang, setLang] = useState(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    return storedLang ?? i18n.resolvedLanguage ?? i18n.language ?? "en";
  });

  useEffect(() => {
    const syncLanguage = (nextLanguage) => {
      setLang(nextLanguage || "en");
    };
    syncLanguage(i18n.resolvedLanguage || i18n.language);
    i18n.on("languageChanged", syncLanguage);
    return () => i18n.off("languageChanged", syncLanguage);
  }, []);

  const changeLanguage = async (_lang) => {
    setLang(_lang);
  };

  const changeTheme = async (_theme) => {
    const nextTheme = _theme === "Dark" ? "Dark" : "Light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const isDark = theme === "Dark";
  const themeClass = `min-h-screen transition-colors duration-500 ${isDark ? "dark bg-void" : "bg-cloud/30"}`;

  const path = window.location.pathname;

  if (path === "/admin/login") {
    return <div className={themeClass}><AdminLogin changeTheme={changeTheme} theme={theme} /></div>;
  }
  if (path === "/admin" || path === "/admin/dashboard") {
    return <div className={themeClass}><AdminLayout changeTheme={changeTheme} theme={theme}><AdminDashboard /></AdminLayout></div>;
  }
  if (path === "/admin/skills") {
    return <div className={themeClass}><AdminLayout changeTheme={changeTheme} theme={theme}><AdminSkills /></AdminLayout></div>;
  }
  if (path === "/admin/portfolios") {
    return <div className={themeClass}><AdminLayout changeTheme={changeTheme} theme={theme}><AdminPortfolios /></AdminLayout></div>;
  }
  if (path === "/admin/messages") {
    return <div className={themeClass}><AdminLayout changeTheme={changeTheme} theme={theme}><AdminMessages /></AdminLayout></div>;
  }
  if (path === "/admin/localizations") {
    return <div className={themeClass}><AdminLayout changeTheme={changeTheme} theme={theme}><AdminLocalizations /></AdminLayout></div>;
  }
  if (path === "/admin/employees") {
    return <div className={themeClass}><AdminLayout changeTheme={changeTheme} theme={theme}><AdminEmployees /></AdminLayout></div>;
  }
  if (path === "/admin/blogs") {
    return <div className={themeClass}><AdminLayout changeTheme={changeTheme} theme={theme}><AdminBlogs /></AdminLayout></div>;
  }
  if (path === "/blog" || path.startsWith("/blog/")) {
    return <div className={themeClass}><Blog changeTheme={changeTheme} theme={theme} lang={lang} changeLanguage={changeLanguage} /></div>;
  }
  if (process.env.REACT_APP_MAINTENANCE_MODE === "true") {
    return <Maintenance />;
  }

  return (
    <div className={themeClass}>
      <PublicApp changeTheme={changeTheme} theme={theme} lang={lang} changeLanguage={changeLanguage} />
    </div>
  );
}

export default App;
