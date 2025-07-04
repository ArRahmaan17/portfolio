import { useRef, useEffect, useState } from "react";
import Typed from "typed.js";
import Header from "./components/Header";
import Skill from "./components/Skill";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import preloaderImg from './assets/preloader.webp';
function App() {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headerOffscreen = () => {
      if (window.pageYOffset > 25) {
        setClassNavbar('rounded-full bg-white dark:bg-slate-800 bg-opacity-40 backdrop-blur-2xl')
      } else {
        setClassNavbar('bg-transparent');
      }
    }
    window.addEventListener('scroll', headerOffscreen);
    let timeout = setTimeout(() => {
      setLoading(false);
    }, 250);
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
        clearTimeout(timeout);
      };
  }, [loading]);
  let params = { node: el, customStyle: style1, classNavbar: classNavbar, changeTheme: changeTheme, theme: theme, changeLanguage: changeLanguage, lang: lang }
  return (
    <>
      <div className={`App select-none flex flex-col font-mono ${theme === 'Dark' ? 'dark' : ''}`}>
        {loading ? <>
          <div className={`w-full h-screen bg-white dark:bg-black flex flex-col items-center justify-center`}>
            <div className='text-center'>
              <img rel='preload' src={preloaderImg} alt="preloader-img" className='h-12 grayscale-0 dark:grayscale md:h-24 mx-auto' />
              <div className='font-bold dark:text-indigo-400 md:text-2xl'>wait a second</div>
              <div ref={el} className='hidden'></div>
            </div>
          </div>
        </> : <>
          <Header {...params} />
          <Skill {...params} />
          <Portfolio {...params} />
          <Contact {...params} />
        </>}
      </div >
    </>
  );
}

export default App;