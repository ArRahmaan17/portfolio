import { useRef, useEffect, useState } from "react";
import Typed from "typed.js";
import Header from "./components/Header";
import Skill from "./components/Skill";
import { Fab } from "react-tiny-fab";
import { animateScroll as scroll } from "react-scroll";
import Portfolio from "./components/Portfolio";
function App() {
  let style1 = {
    clipPath:
      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
  };
  let el = useRef(null);
  let [styleFab, setStyleFab] = useState({ display: 'none' })
  useEffect(() => {
    const headerOffscreen = () => {
      if (window.pageYOffset > 25) {
        styleFab = setStyleFab({ display: 'inline-flex', bottom: '24px', right: '24px' })
      } else {
        styleFab = setStyleFab({ display: 'none' });
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
  let params = { node: el, customStyle: style1 }
  const scrollToTop = () => {
    scroll.scrollToTop()
  }
  return (
    <div className="App select-none" >
      <Header  {...params} />
      <Skill {...params} />
      <Portfolio {...params} />
      <Fab icon="&uarr;" onClick={scrollToTop} style={styleFab}></Fab>
    </div >
  );
}

export default App;
