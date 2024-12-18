import React, { useEffect, useState } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import { LANGUAGES, themes } from "../constants";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/logo.png";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
const Home = (props) => {
  const { i18n, t } = useTranslation();
  let [stateOffCanvas, setStateOffCanvas] = useState(false);
  let [stateLangDropdown, setStateLangDropdown] = useState(false);
  let [stateThemeDropdown, setStateThemeDropdown] = useState(false);
  let [lang, setLang] = useState(sessionStorage.getItem("i18nextLng") ?? "en");
  let [stateLangOffCanvas, setStateLangOffCanvas] = useState(false);
  const changeLanguage = async () => {
    await i18n.changeLanguage(sessionStorage.getItem("i18nextLng"));
  };
  const changeTheme = async () => {
    props.changeTheme(localStorage.getItem("theme"));
  };
  const changeOffCanvas = () => {
    stateOffCanvas = setStateOffCanvas(!stateOffCanvas);
  };
  useEffect(() => {
    changeLanguage();
    changeTheme();
  }, [localStorage.getItem("theme")]);
  return (
    <div className="dark:bg-black">
      <header className={`fixed inset-x-0 top-0 z-50`}>
        <nav
          id="navbar-menu"
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex cursor-pointer lg:flex-1">
            <div
              onClick={() => {
                scroll.scrollToTop();
              }}
              className="-m-1.5 p-1.5"
            >
              <img
                className="h-8 w-auto grayscale dark:grayscale-0"
                src={logo}
                alt=""
              ></img>
            </div>
          </div>
          <div className="flex lg:hidden">
            <button
              onClick={changeOffCanvas}
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-black dark:text-indigo-400"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div
            className={`hidden p-5 transition-all duration-300 ease-in-out ${props.classNavbar} lg:flex lg:gap-x-12`}
          >
            <div
              onClick={() => {
                scroll.scrollToTop();
              }}
              className="cursor-pointer text-sm font-semibold leading-6 text-black dark:text-indigo-400"
            >
              {t("home")}
            </div>
            <Link
              smooth={true}
              to="stack"
              className="cursor-pointer text-sm font-semibold leading-6 text-black dark:text-indigo-400"
            >
              Stack
            </Link>
            <Link
              smooth={true}
              to="portfolio"
              className="cursor-pointer text-sm font-semibold leading-6 text-black dark:text-indigo-400"
            >
              {t("portfolio")}
            </Link>
            <Link
              smooth={true}
              to="contact"
              className="cursor-pointer text-sm font-semibold leading-6 text-black dark:text-indigo-400"
            >
              {t("contact")}
            </Link>
          </div>
          <div className="hidden gap-x-3 lg:flex lg:flex-1 lg:justify-end">
            <div
              className="cursor-pointer text-sm font-semibold leading-6 text-black dark:text-indigo-400"
              onClick={() => {
                setStateLangDropdown(!stateLangDropdown);
                if (stateThemeDropdown === true) {
                  setStateThemeDropdown(!stateThemeDropdown);
                }
              }}
            >
              {lang.toUpperCase()}
            </div>
            {/* dropdown */}
            <div
              className={`right-6 z-10 mt-8 ${stateLangDropdown ? "absolute" : "hidden"} w-48 origin-top-left rounded-md py-1 shadow-md shadow-slate-200/15 ring-1 ring-black ring-opacity-5 hover:outline-none dark:bg-slate-800`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex="-1"
            >
              {LANGUAGES.map(({ code, label }) => (
                <div
                  onClick={() => {
                    i18n.changeLanguage(code);
                    setStateLangDropdown(!stateLangDropdown);
                    lang = setLang(code);
                    sessionStorage.setItem("i18nextLng", code);
                    changeLanguage(code);
                  }}
                  className="block cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-slate-100 dark:text-indigo-400 hover:dark:bg-slate-700 hover:dark:text-indigo-500"
                  role="menuitem"
                  tabIndex="-1"
                  key={code}
                >
                  {label}
                </div>
              ))}
            </div>
            <div
              className="cursor-pointer text-sm font-semibold leading-6 text-black dark:text-indigo-400"
              onClick={() => {
                setStateThemeDropdown(!stateThemeDropdown);
                if (stateLangDropdown === true) {
                  setStateLangDropdown(!stateLangDropdown);
                }
              }}
            >
              {props.theme === "Dark" ? (
                <FontAwesomeIcon icon={faMoon} size={"lg"} />
              ) : (
                <FontAwesomeIcon icon={faSun} size={"lg"} />
              )}
            </div>
            {/* dropdown */}
            <div
              className={`right-6 z-10 mt-8 ${stateThemeDropdown ? "absolute" : "hidden"} w-48 origin-top-left rounded-md py-1 shadow-md shadow-slate-200/15 ring-1 ring-black ring-opacity-5 hover:outline-none dark:bg-slate-800`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex="-1"
            >
              {themes.map(({ icon, label }) => (
                <div
                  onClick={() => {
                    setStateThemeDropdown(!stateThemeDropdown);
                    localStorage.setItem("theme", label);
                  }}
                  className={`block cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-slate-100 dark:text-indigo-400 hover:dark:bg-slate-700 hover:dark:text-indigo-500`}
                  role="menuitem"
                  tabIndex="-1"
                  key={label}
                >
                  <FontAwesomeIcon icon={icon} size={"lg"} /> {label}
                </div>
              ))}
            </div>
          </div>
        </nav>
        {/* offcanvas */}
        <div
          id="offcanvas-menu"
          className={`${stateOffCanvas ? "lg:hidden" : "hidden lg:hidden"} transition-all delay-0 duration-300`}
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-black">
            <div className="flex items-center justify-between">
              <button
                to="#"
                className="-m-1.5 cursor-default p-1.5 opacity-100 sm:opacity-0"
              >
                <img className="h-8 w-auto" src={logo} alt=""></img>
              </button>
              <button
                onClick={changeOffCanvas}
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-black dark:text-indigo-400"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6">
                <div className="cursor-pointer space-y-2 py-6">
                  <div
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-slate-300 hover:text-black dark:text-indigo-400 dark:hover:bg-indigo-400"
                    onClick={() => {
                      scroll.scrollToTop();
                      changeOffCanvas(!stateOffCanvas);
                    }}
                  >
                    Home
                  </div>
                  <Link
                    to="stack"
                    smooth={true}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-slate-300 hover:text-black dark:text-indigo-400 dark:hover:bg-indigo-400"
                    onClick={changeOffCanvas}
                  >
                    Stack
                  </Link>
                  <Link
                    to="portfolio"
                    smooth={true}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-slate-300 hover:text-black dark:text-indigo-400 dark:hover:bg-indigo-400"
                    onClick={changeOffCanvas}
                  >
                    Portfolio
                  </Link>
                  <Link
                    to="contact"
                    smooth={true}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-slate-300 hover:text-black dark:text-indigo-400 dark:hover:bg-indigo-400"
                    onClick={changeOffCanvas}
                  >
                    Contact
                  </Link>
                  <div
                    onClick={() => {
                      changeOffCanvas();
                      if (props.theme === "Dark") {
                        localStorage.setItem("theme", "Light");
                      } else {
                        localStorage.setItem("theme", "Dark");
                      }
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-slate-300 hover:text-black dark:text-indigo-400 dark:hover:bg-indigo-400"
                  >
                    {props.theme === "Dark" ? (
                      <FontAwesomeIcon icon={faMoon} size={"lg"} />
                    ) : (
                      <FontAwesomeIcon icon={faSun} size={"lg"} />
                    )}{" "}
                    {props.theme ?? "Light"}
                  </div>
                </div>
                <div className="cursor-pointer pt-3">
                  <div
                    onClick={() => {
                      setStateLangOffCanvas(!stateLangOffCanvas);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-slate-300 hover:text-black dark:text-indigo-400 dark:hover:bg-indigo-400"
                  >
                    {lang.toUpperCase()}
                  </div>
                  {LANGUAGES.map(({ code, label }) => (
                    <div
                      onClick={() => {
                        i18n.changeLanguage(code);
                        lang = setLang(code);
                        sessionStorage.setItem("i18nextLng", code);
                        setStateLangOffCanvas(!stateLangOffCanvas);
                        changeOffCanvas();
                      }}
                      className={`${stateLangOffCanvas ? "translate-y-6 opacity-100" : "-translate-y-1/4 opacity-0"} transform px-4 py-2 text-sm text-gray-400 delay-100 duration-500 ease-out hover:rounded-lg hover:bg-slate-300 hover:text-black dark:hover:bg-indigo-400`}
                      role="menuitem"
                      tabIndex="-1"
                      key={code}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="relative isolate px-6 py-48 lg:px-8 lg:py-56">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-left lg:text-center">
            <h1 className="text-4xl font-bold sm:text-6xl dark:text-gray-400">
              {t("introduction")}
            </h1>
            <div className="flex justify-start lg:justify-center">
              <h1 className="text-lg font-bold sm:text-2xl dark:text-gray-400">
                {t("im")}
              </h1>
              &nbsp;
              <h1
                className="text-lg font-bold text-indigo-400 sm:text-2xl"
                ref={props.node}
              ></h1>
            </div>
            <p className="text-md mt-6 leading-8 sm:text-sm/9 dark:text-gray-400">
              {t("short_intro")}
            </p>
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default Home;
