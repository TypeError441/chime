import { watch, reactive } from "vue";

import { useAppearance, useCustomtheme } from "./settings";
import themes from "../assets/themes.json";

export function useApplySettings() {
    const appearance = useAppearance();
    const customtheme = useCustomtheme();

    const theme = reactive({});

    function syncTheme() {
        const src =
            appearance.theme === "custom"
                ? customtheme
                : themes[appearance.theme];

        Object.assign(theme, src);
    }

    // initial load
    syncTheme();

    // resync when theme changes
    watch(() => appearance.theme, syncTheme, { immediate: true });

    watch(customtheme, syncTheme, { deep: true });


    function getTheme() {
        return theme;
    }

    function applyTheme() {
        if (theme.meta?.version == undefined) { // Pre update
            document.documentElement.style.setProperty("--background-color", theme.backgroundColor);
            document.documentElement.style.setProperty("--color", theme.color);
            document.documentElement.style.setProperty("--accent-color", theme.sidebarBackgroundColor);
            document.documentElement.style.setProperty("--secondary-accent-color", theme.radialBackgroundColor);
            document.documentElement.style.setProperty("--image-on-bg-brightness", theme.imageOnBgBrightness);
            if (appearance.theme == "custom") {
                if (theme.backgroundImage) {
                    URL.revokeObjectURL(theme.backgroundImage);
                }
                theme.backgroundImage = URL.createObjectURL(theme.backgroundBlob);
            }
        }
        else if (theme.meta?.version >= 2) {
            document.documentElement.style.setProperty("--background-color", theme.background.colors[0]);
            document.documentElement.style.setProperty("--background-speed", theme.background.speed);
            
            document.documentElement.style.setProperty("--color", theme.colors.text);
            document.documentElement.style.setProperty("--accent-color", theme.colors.accentColor);
            document.documentElement.style.setProperty("--secondary-accent-color", theme.colors.secondaryAccentColor);
            document.documentElement.style.setProperty("--image-on-bg-brightness", theme.imageOnBgBrightness);
        }
    }

    function applyFont() {
        document.documentElement.style.setProperty("font-family", appearance.font);
    }

    return { applyTheme, applyFont, getTheme };
}