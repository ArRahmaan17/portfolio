import { useRef, useEffect, useState } from "react";
import Typed from "typed.js";
import Header from "./components/Header";
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
import Maintenance from "./components/Maintenance";

function PublicApp({ theme, changeTheme }) {
  let style1 = {
    clipPath:
      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
  };
  let el = useRef(null);
  let [lang, setLang] = useState(sessionStorage.getItem("i18nextLng") ?? "en");
  let [classNavbar, setClassNavbar] = useState("bg-transparent");

  const changeLanguage = async (_lang) => {
    setLang(_lang);
  };

  useEffect(() => {
    const headerOffscreen = () => {
      if (window.pageYOffset > 25) {
        setClassNavbar("rounded-full bg-white dark:bg-slate-800 bg-opacity-40 backdrop-blur-2xl");
      } else {
        setClassNavbar("bg-transparent");
      }
    };
    window.addEventListener("scroll", headerOffscreen);
    const typed = new Typed(el.current, {
      strings: ["Software Engineer", "Ardhi Rahmaan"],
      typeSpeed: 200,
      loop: true,
      showCursor: false,
      backSpeed: 100,
      loopCount: 3,
    });
    return () => {
      window.removeEventListener("scroll", headerOffscreen);
      typed.destroy();
    };
  }, []);
  let params = {
    node: el,
    customStyle: style1,
    classNavbar: classNavbar,
    changeTheme: changeTheme,
    theme: theme,
    changeLanguage: changeLanguage,
    lang: lang,
  };
  return (
    <>
      <div className="App select-none flex flex-col font-mono">
        <Header {...params} />
        <div role="main">
          <Skill {...params} />
          <Portfolio {...params} />
          <Contact {...params} />
        </div>
      </div>
    </>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "Dark" ? "Dark" : "Light";
  });

  const changeTheme = async (_theme) => {
    const nextTheme = _theme === "Dark" ? "Dark" : "Light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const isDark = theme === "Dark";

  if (window.location.pathname === "/admin/login") {
    return (
      <div className={`${isDark ? "dark" : ""}`}>
        <AdminLogin changeTheme={changeTheme} theme={theme} />
      </div>
    );
  }

  if (window.location.pathname === "/admin" || window.location.pathname === "/admin/dashboard") {
    return (
      <div className={`${isDark ? "dark" : ""}`}>
        <AdminLayout changeTheme={changeTheme} theme={theme}>
          <AdminDashboard />
        </AdminLayout>
      </div>
    );
  }

  if (window.location.pathname === "/admin/skills") {
    return (
      <div className={`${isDark ? "dark" : ""}`}>
        <AdminLayout changeTheme={changeTheme} theme={theme}>
          <AdminSkills />
        </AdminLayout>
      </div>
    );
  }

  if (window.location.pathname === "/admin/portfolios") {
    return (
      <div className={`${isDark ? "dark" : ""}`}>
        <AdminLayout changeTheme={changeTheme} theme={theme}>
          <AdminPortfolios />
        </AdminLayout>
      </div>
    );
  }

  if (window.location.pathname === "/admin/messages") {
    return (
      <div className={`${isDark ? "dark" : ""}`}>
        <AdminLayout changeTheme={changeTheme} theme={theme}>
          <AdminMessages />
        </AdminLayout>
      </div>
    );
  }

  if (window.location.pathname === "/admin/localizations") {
    return (
      <div className={`${isDark ? "dark" : ""}`}>
        <AdminLayout changeTheme={changeTheme} theme={theme}>
          <AdminLocalizations />
        </AdminLayout>
      </div>
    );
  }

  if (window.location.pathname === "/admin/employees") {
    return (
      <div className={`${isDark ? "dark" : ""}`}>
        <AdminLayout changeTheme={changeTheme} theme={theme}>
          <AdminEmployees />
        </AdminLayout>
      </div>
    );
  }

  if (process.env.REACT_APP_MAINTENANCE_MODE === "true") {
    return <Maintenance />;
  }

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <PublicApp changeTheme={changeTheme} theme={theme} />
    </div>
  );
}

export default App;
