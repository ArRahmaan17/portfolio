import {SunDim, SunMoon} from "lucide-react";

export const LANGUAGES = [
    { label: "English", code: "en" },
    { label: "Indonesia", code: "id" },
];
export const themes = [
    { icon: <SunDim/>, label: "Light" },
    { icon: <SunMoon/>, label: "Dark" },
]
export const experience = [
    { year: 1, label: "Beginner" },
    { year: 2, label: "Intermediate" },
    { year: 5, label: "Advanced" },
    { year: 10, label: "Expert" },
]

export * from "./api";
