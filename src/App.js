import { useRef, useEffect, useState } from "react";
import Typed from "typed.js";
import Header from "./components/Header";
import Skill from "./components/Skill";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
function App() {
  let style1 = {
    clipPath:
      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
  };
  let el = useRef(null);
  let [classNavbar, setclassNavbar] = useState('bg-transparent')
  useEffect(() => {
    const headerOffscreen = () => {
      if (window.pageYOffset > 25) {
        classNavbar = setclassNavbar('rounded-full bg-white bg-opacity-20 backdrop-blur-3xl')
      } else {
        classNavbar = setclassNavbar('bg-transparent');
      }
    }
    window.addEventListener('scroll', headerOffscreen);

    const typed = new Typed(el.current, {
      strings: ["Software Engineer", "Ardhi Rahmaan"],
      typeSpeed: 100,
      loop: true,
      showCursor: false,
      backSpeed: 100,
      loopCount: 3,
    });
    return () => {
      typed.destroy();
    };

  }, []);
  let params = { node: el, customStyle: style1, classNavbar: classNavbar }
  return (
    <>
      <div className="App select-none flex flex-col divide-y-2 divide-double divide-blue-400/25">
        <Header  {...params} />
        <Skill {...params} />
        <Portfolio {...params} />
        <Contact {...params} />
      </div >
    </>
  );
}

export default App;
