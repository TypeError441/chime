import { get } from "/chime/js/idb-helper.js";

const savedTheme = await get("settings", "theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);