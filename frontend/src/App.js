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
import Maintenance from "./components/Maintenance";

function PublicApp() {
  let style1 = {
    clipPath:
      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
  };
  let el = useRef(null);
  let [theme, setTheme] = useState(localStorage.getItem("theme"));
  let [lang, setLang] = useState(sessionStorage.getItem("i18nextLng") ?? "en");
  let [classNavbar, setClassNavbar] = useState('bg-transparent');
  const changeTheme = async (_theme) => {
    setTheme(_theme)
  };
  const changeLanguage = async (_lang) => {
    setLang(_lang);
  };

  useEffect(() => {
    const headerOffscreen = () => {
      if (window.pageYOffset > 25) {
        setClassNavbar('rounded-full bg-white dark:bg-slate-800 bg-opacity-40 backdrop-blur-2xl')
      } else {
        setClassNavbar('bg-transparent');
      }
    }
    window.addEventListener('scroll', headerOffscreen);
    const typed = new Typed(el.current, {
      strings: ["Software Engineer", "Ardhi Rahmaan"],
      typeSpeed: 200,
      loop: true,
      showCursor: false,
      backSpeed: 100,
      loopCount: 3,
    });
    return () => {
      typed.destroy();
    };
  }, []);
  let params = { node: el, customStyle: style1, classNavbar: classNavbar, changeTheme: changeTheme, theme: theme, changeLanguage: changeLanguage, lang: lang }
  return (
    <>
      <div className={`App select-none flex flex-col font-mono ${theme === 'Dark' ? 'dark' : ''}`}>
        <Header {...params} />
        <div role="main">
          <Skill {...params} />
          <Portfolio {...params} />
          <Contact {...params} />
        </div>
      </div >
    </>
  );
}

function AdminDashboardRoute() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}

function App() {
  if (process.env.REACT_APP_MAINTENANCE_MODE === "true") {
    return <Maintenance />;
  }

  if (window.location.pathname === "/admin/login") {
    return <AdminLogin />;
  }

  if (window.location.pathname === "/admin" || window.location.pathname === "/admin/dashboard") {
    return <AdminDashboardRoute />;
  }

  if (window.location.pathname === "/admin/skills") {
    return (
      <AdminLayout>
        <AdminSkills />
      </AdminLayout>
    );
  }

  if (window.location.pathname === "/admin/portfolios") {
    return (
      <AdminLayout>
        <AdminPortfolios />
      </AdminLayout>
    );
  }

  if (window.location.pathname === "/admin/messages") {
    return (
      <AdminLayout>
        <AdminMessages />
      </AdminLayout>
    );
  }

  return <PublicApp />;
}

export default App;
