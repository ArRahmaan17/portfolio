import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import tailwindcss from "../assets/stack-logos/tailwindcss.svg";
import laravel from "../assets/stack-logos/laravel.svg";
import expressjs from "../assets/stack-logos/expressjs.svg";
import react from "../assets/stack-logos/react.svg";
import nodejs from "../assets/stack-logos/nodejs.svg";
import docker from "../assets/stack-logos/docker.svg";
import bootstrap from "../assets/stack-logos/bootstrap.svg";

export const LANGUAGES = [
    { label: "English", code: "en" },
    { label: "Indonesia", code: "id" },
];
export const themes = [
    { icon: faSun, label: "Light" },
    { icon: faMoon, label: "Dark" },
]
export const experience = [
    { year: 1, label: "Beginner" },
    { year: 2, label: "Intermediate" },
    { year: 5, label: "Advanced" },
    { year: 10, label: "Expert" },
]
export const skill = [
    {
        name: "Laravel",
        start: '2021-10',
        imageUrl: laravel,
    },
    {
        name: "Tailwind Css",
        start: '2024-01',
        imageUrl: tailwindcss,
    },
    {
        name: "Express Js",
        start: '2024-01',
        imageUrl: expressjs,
    },
    {
        name: "React Js",
        start: '2024-03',
        imageUrl: react,
    },
    {
        name: "Node Js",
        start: '2024-01',
        imageUrl: nodejs,
    },
    {
        name: "Docker",
        start: '2024-05',
        imageUrl: docker,
    },
    {
        name: "Bootstrap",
        start: '2022-05',
        imageUrl: bootstrap,
    },
]