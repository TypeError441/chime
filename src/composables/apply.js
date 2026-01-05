import { useAppearance, useCustomtheme } from "./settings";
import themes from "../assets/themes.json";

export function useApplySettings() {
    const appearance = useAppearance();
    const customtheme = useCustomtheme();

    function applyTheme() {
        const theme = themes[appearance.theme];

        if (appearance.theme == "custom") {
            document.documentElement.style.setProperty("--background-color", customtheme.backgroundColor);

            if (customtheme.backgroundImage) {
                document.documentElement.style.setProperty(
                    "--background-image",
                    customtheme.backgroundImage
                );
            } else {
                document.documentElement.style.setProperty("--background-image", "none");
            }
            
            document.documentElement.style.setProperty("--color", customtheme.color);
            document.documentElement.style.setProperty("--sidebar-background-color", customtheme.sidebarBackgroundColor);
            document.documentElement.style.setProperty("--radial-background-color", customtheme.radialBackgroundColor);
            document.documentElement.style.setProperty("--image-on-bg-brightness", customtheme.imageOnBgBrightness);
        }
        else {
            document.documentElement.style.setProperty("--background-color", theme.backgroundColor);
            document.documentElement.style.setProperty("--background-image", theme.backgroundImage.trim() == "" ? "none" : `url("${theme.backgroundImage}")`);
            document.documentElement.style.setProperty("--color", theme.color);
            document.documentElement.style.setProperty("--sidebar-background-color", theme.sidebarBackgroundColor);
            document.documentElement.style.setProperty("--radial-background-color", theme.radialBackgroundColor);
            document.documentElement.style.setProperty("--image-on-bg-brightness", theme.imageOnBgBrightness);
        }
    }

    function applyFont() {
        document.documentElement.style.setProperty("font-family", appearance.font);
    }

    return { applyTheme, applyFont };
}