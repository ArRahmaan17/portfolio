import React, { useEffect } from "react";
import { skill } from "../constants";
import { useTranslation } from "react-i18next";
import moment from "moment/min/moment-with-locales";
const Skill = (props) => {
  const { i18n, t } = useTranslation();
  const skills = skill;
  useEffect(() => {
    i18n.changeLanguage(props.lang);
    moment.locale(`${props.lang}`);
  }, [props.lang]);
  return (
    <div className="dark:bg-black" id="stack">
      <div className="relative isolate px-6 py-16 lg:px-8 lg:py-56">
        <div
          className="sm:-top-70 absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
        <div className="mx-50 max-w-auto py-8 md:mx-20 md:py-16 lg:mx-5">
          <p className="pb-10 pt-8 text-center text-2xl md:text-4xl lg:text-6xl dark:text-gray-400">
            {t("stack")}
          </p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 pb-36 pt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((_skill) => (
              <div
                key={_skill.name}
                className="delay-50 group cursor-pointer rounded-md bg-slate-100 p-3 outline outline-offset-0 outline-slate-300 transition-all duration-500 ease-in-out hover:outline hover:outline-offset-4 hover:outline-indigo-200 hover:transition-all hover:duration-100 dark:bg-slate-700/90 dark:outline-slate-400/70 hover:dark:bg-slate-100/40 hover:dark:outline-indigo-500/80"
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none scale-100 transition duration-500 group-hover:scale-125 md:grayscale group-hover:md:grayscale-0"
                    src={_skill.imageUrl}
                    alt={_skill.name}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="translate-y-4 text-sm font-semibold leading-6 transition-all group-hover:translate-y-1 dark:text-gray-400 group-hover:dark:text-gray-300">
                      {_skill.name}
                    </p>
                    <p className="mt-1 hidden scale-y-0 truncate text-xs leading-5 transition-all delay-1000 duration-300 ease-in-out group-hover:block group-hover:scale-y-100 group-hover:transition-transform group-hover:delay-1000 group-hover:duration-1000 group-hover:ease-in-out dark:text-gray-300">
                      {moment(_skill.start).fromNow(true)} {t("experience")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
export default Skill;
