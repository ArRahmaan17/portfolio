import React from "react";
import simpkl from "../assets/portfolio/sim-pkl.png";
import publicchat from "../assets/portfolio/public-chat.png";

export default function Portfolio(props) {
  const projects = [
    {
      id: 1,
      name: "SIM PKL",
      link: "http://simpkl.rahmaanms.my.id",
      image: simpkl,
      types: [
        { id: 1, name: "Laravel", link: "https://laravel.com" },
        { id: 2, name: "Bootstrap", link: "https://getbootstrap.com" },
      ],
    },
    {
      id: 2,
      name: "Public Chat",
      link: "http://chat.rahmaanms.my.id",
      image: publicchat,
      types: [
        { id: 1, name: "Node Js", link: "https://nodejs.org" },
        { id: 2, name: "Express Js", link: "https://expressjs.com" },
        { id: 3, name: "React Js", link: "https://react.dev" },
      ],
    },
  ];
  return (
    <div className="bg-black" id="portfolio">
      <div className="relative isolate px-1 py-16 lg:px-8 lg:py-56">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={props.customStyle}
          ></div>
        </div>
        <div className="mx-10 md:mx-50 lg:mx-30 max-w-auto py-8 md:py-12">
          <p className="text-center pt-8 pb-10 text-2xl md:text-4xl lg:text-6xl text-white">
            Portfolio
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pt-10 pb-8">
            {projects.map((project) => (
              <a
                href={project.link}
                key={project.id}
                rel="noreferrer"
                target="_blank"
                className="bg-slate-700/60 p-3 rounded-md hover:bg-slate-700/80 cursor-pointer group transition-all delay-50 duration-300 ease-in-out min-w-56"
              >
                <div className="flex flex-col min-w-0 gap-x-4">
                  <img
                    className="flex-1 h-full w-auto rounded-md"
                    src={project.image}
                    alt={project.name}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-2xl font-semibold leading-6 text-gray-300  mt-1">
                      {project.name}
                    </p>
                    <div className="mt-5 truncate text-sm flex flex-row gap-2 flex-wrap">
                      {project.types.map((type) => (
                        <p
                          className="basis-1 text-sm font-sx text-gray-400 mt-1 group-hover:text-gray-100"
                          key={type.id}
                        >
                          {type.name}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
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
}
