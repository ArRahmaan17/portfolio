import React from "react";
import simpkl from "../assets/portfolio/sim-pkl.png";
import publicchat from "../assets/portfolio/public-chat.png";
import notfound from "../assets/portfolio/not-found.jpg";
import restapisanctum from "../assets/portfolio/rest-api-sanctum.png";

export default function Portfolio(props) {
  const projects = [
    {
      id: 1,
      name: "SIM PKL",
      link: "https://github.com/ArRahmaan17/sim_pkl",
      image: simpkl,
      types: [
        { id: 1, name: "Laravel" },
        { id: 2, name: "Bootstrap" },
      ],
    },
    {
      id: 2,
      name: "Frontend Public Chat",
      link: "https://github.com/ArRahmaan17/frontend-sim-pkl",
      image: publicchat,
      types: [
        { id: 1, name: "Node Js" },
        { id: 3, name: "React Js" },
      ],
    },{
      id: 3,
      name: "Backend Public Chat",
      link: "https://github.com/ArRahmaan17/backend-sim-pkl",
      image: publicchat,
      types: [
        { id: 1, name: "Node Js" },
        { id: 2, name: "Express Js" },
      ],
    },{
      id: 4,
      name: "Simple Rest Api (Sanctum)",
      link: "https://github.com/ArRahmaan17/todolist-auth-sanctum",
      image: restapisanctum,
      types: [
        { id: 1, name: "Laravel" },
      ],
    },{
      id: 5,
      name: "Wa Services Presensi PKL (API)",
      link: "https://github.com/ArRahmaan17/simpkl-whatsappblast-services",
      image: notfound,
      types: [
        { id: 1, name: "Node Js" },
        { id: 2, name: "Express Js" },
      ],
    },
  ];
  return (
    <div className="dark:bg-black" id="portfolio">
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
        <div className="md:mx-50 lg:mx-30 max-w-auto mx-10 py-8 md:py-12">
          <p className="pb-10 pt-8 text-center text-2xl text-white md:text-4xl lg:text-6xl">
            Portfolio
          </p>
          <div className="flex flex-wrap justify-center gap-10 pb-8 pt-10">
            {projects.map((project) => (
              <a
                href={project.link}
                key={project.id}
                rel="noreferrer"
                target="_blank"
                className="delay-50 lg:basis-4/3 group min-w-56 basis-full cursor-pointer rounded-md bg-slate-700/60 p-3 transition-all duration-300 ease-out hover:bg-slate-700/80 hover:outline hover:outline-offset-4 hover:outline-indigo-700 md:basis-1/3"
              >
                <div className="flex min-w-0 flex-col gap-x-4">
                  <img
                    className="h-full w-auto flex-1 rounded-md"
                    src={project.image}
                    alt={project.name}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="mt-5 text-2xl font-semibold leading-6 text-gray-300">
                      {project.name}
                    </p>
                    <div className="mt-5 flex flex-row flex-wrap gap-2 truncate text-sm">
                      {project.types.map((type) => (
                        <p
                          className="font-sx mt-1 basis-1 text-sm text-gray-400 group-hover:text-gray-100"
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
