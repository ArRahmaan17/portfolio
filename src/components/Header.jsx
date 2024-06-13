import React, { useState } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
const Home = (props) => {
  let [stateOffCanvas, setStateOffCanvas] = useState(false);
  const changeOffCanvas = () => {
    stateOffCanvas = setStateOffCanvas(!stateOffCanvas);
  };
  return (
    <div className="bg-black">
      <header className="fixed md:absolute inset-x-0 top-0 z-50">
        {/* navbar */}
        <nav
          id="navbar-menu"
          className="flex items-center justify-between p-6 lg:px-8 "
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="navbar-menu" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              ></img>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              onClick={changeOffCanvas}
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
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
          <div className="hidden lg:flex lg:gap-x-12">
            <div
              to="navbar-menu"
              onClick={() => {
                scroll.scrollToTop();
              }}
              className="text-sm font-semibold leading-6 text-gray-400 cursor-pointer"
            >
              Home
            </div>
            <Link
              smooth={true}
              to="stack"
              className="text-sm font-semibold leading-6 text-gray-400 cursor-pointer"
            >
              Stack
            </Link>
            <Link
              smooth={true}
              to="portfolio"
              className="text-sm font-semibold leading-6 text-gray-400 cursor-pointer"
            >
              Portfolio
            </Link>
            <Link
              smooth={true}
              to="contact"
              className="text-sm font-semibold leading-6 text-gray-400 cursor-pointer"
            >
              Contact
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              to="#"
              className="text-sm font-semibold leading-6 text-gray-400"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
        {/* offcanvas */}
        <div
          id="offcanvas-menu"
          className={stateOffCanvas ? "lg:hidden" : "hidden lg:hidden"}
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                ></img>
              </Link>
              <button
                onClick={changeOffCanvas}
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white"
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
                <div className="space-y-2 py-6">
                  <div
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:text-black hover:bg-gray-50"
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
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:text-black hover:bg-gray-50"
                    onClick={changeOffCanvas}
                  >
                    Stack
                  </Link>
                  <Link
                    to="portfolio"
                    smooth={true}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:text-black hover:bg-gray-50"
                    onClick={changeOffCanvas}
                  >
                    Portfolio
                  </Link>
                  <Link
                    to="contact"
                    smooth={true}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:text-black hover:bg-gray-50"
                    onClick={changeOffCanvas}
                  >
                    Contact
                  </Link>
                </div>
                <div className="py-6">
                  <Link
                    to="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-200 hover:text-black hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="relative isolate px-6 py-48 lg:py-56 lg:px-8">
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
          <div className="lg:text-center text-left">
            <h1 className="text-4xl font-bold text-gray-400 sm:text-6xl">
              Introduction.
            </h1>
            <div className="flex lg:justify-center justify-start">
              <h1 className="text-lg font-bold text-gray-400 sm:text-2xl">
                I'm &nbsp;
              </h1>
              <h1
                className="text-lg font-bold text-gray-100 sm:text-2xl"
                ref={props.node}
              >
                &nbsp;
              </h1>
            </div>
            <p className="mt-6 text-sm leading-8 text-gray-400">
              As a software engineer with 2.5 years experience, I focus on
              creating user-friendly solutions for complex challenges. I'm
              passionate about coding and staying updated on new tech trends. My
              goal is to deliver top-notch software that exceeds expectations,
              whether I'm working solo or with a team. I thrive in innovative
              environments, always looking to enhance my skills and push
              technology forward.
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
