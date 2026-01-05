import themes from "../assets/themes.json";

export function createDefaultAppearance() {
    return {
        theme: "default-light",
        font: "'Inter', sans-serif",
        weather: "right",
        pie: "true",
        newtabquicklinks: "false",
        piesize: 90,
        notificationSide: "left",
        feedbackButton: "left",
        sidebarButton: "right"
    };
}

export function createDefaultCustomtheme() {
    return structuredClone(themes["default-light"]);
}

export function createDefaultSchool() {
    return "egan";
}

export function createDefaultQuickLinks() {
    return [
        { title: "PowerSchool", url: "https://powerschool.losaltos.k12.ca.us/public/", side: "right" },
        { title: "Classroom", url: "https://classroom.google.com/", side: "right" }
    ];
}