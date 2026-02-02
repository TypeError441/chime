// Track background object URL for custom theme image lifecycle
let backgroundObjectURL = null;
import { toRaw, watch } from 'vue';

import notificationData from "../assets/notifications.json";

import { useAppearance, useCustomtheme, usePeriods, useCurrentDialog, useSchool, useQuickLinks, useId, useNotifications } from "../composables/settings";
import { createDefaultAppearance, createDefaultCustomtheme, createDefaultSchool, createDefaultQuickLinks } from "./default";
import { useCookies } from "../composables/cookie";

import { useIDB } from "../composables/idb";
const idb = useIDB();

export function useLoadLocalStorageSettings() {
    const defaultAppearance = createDefaultAppearance();
    const defaultCustomtheme = createDefaultCustomtheme();
    const defaultSchool = createDefaultSchool();
    const defaultQuickLinks = createDefaultQuickLinks();

    const appearance = useAppearance();
    const customtheme = useCustomtheme();
    const periods = usePeriods();
    const currentDialog = useCurrentDialog();
    const school = useSchool();
    const quickLinks = useQuickLinks();
    const id = useId();
    const notifications = useNotifications();
    const notificationNames = Object.keys(notificationData);
    const { getCookie, setCookie } = useCookies();

    async function loadLocalStorageSettings() {
        let settings = await idb.get("settings");

        // Appearance
        let loadedAppearance = defaultAppearance;

        if (settings?.appearance !== undefined) {
            loadedAppearance = settings.appearance;
        }

        Object.assign(appearance, loadedAppearance);

        // Custom Theme
        if (settings?.customtheme?.meta?.version !== undefined) {
            Object.assign(customtheme, settings.customtheme);
        } else {
            Object.assign(customtheme, defaultCustomtheme);
        }

        // Periods
        let loadedPeriods = {};

        if (settings?.periods !== undefined) {
            loadedPeriods = settings.periods;
        }
        
        Object.assign(periods, loadedPeriods);

        // Current Dialog
        let loadedCurrentDialog = false;

        if (settings?.loadedCurrentDialog !== undefined) {
            loadedCurrentDialog = settings.loadedCurrentDialog;
        }

        currentDialog.value = loadedCurrentDialog;

        // School
        let loadedSchool = defaultSchool;

        if (settings?.school !== undefined) {
            loadedSchool = settings.school;
        }

        school.value = loadedSchool;

        // Quick Links
        let loadedQuickLinks = defaultQuickLinks;

        if (settings?.quickLinks !== undefined) {
            loadedQuickLinks = settings.quickLinks;
        }
        
        quickLinks.splice(0, quickLinks.length);

        loadedQuickLinks.forEach(quickLink => {
            quickLinks.push(quickLink);
        });

        // ID
        let loadedId = Math.floor(Math.random() * 9999) + 1;

        if (settings?.id !== undefined) {
            loadedId = settings.id;
        }

        const usedCookiesId = getCookie("id") !== null;
        if (usedCookiesId) {
            loadedId = getCookie("id");
        }
        
        id.value = loadedId;

        // Notifications
        let loadedNotifications = {};
        notificationNames
            .filter(n => !notificationData[n].hidden)
            .forEach(n => loadedNotifications[n] = false);

        if (settings?.notifications !== undefined) {
            loadedNotifications = settings.notifications;
        } else {
            notificationNames
                .filter(n => !notificationData[n].hidden)
                .forEach(n => {
                    const ls = localStorage.getItem(n);
                    if (ls !== null) {
                        loadedNotifications[n] = ls === "1";
                    }
                });
        }
        
        Object.assign(notifications, loadedNotifications);

        // Watch for runtime changes to backgroundBlob
        watch(
            () => customtheme.backgroundBlob,
            (blob) => {

                if (backgroundObjectURL) {
                    URL.revokeObjectURL(backgroundObjectURL);
                    backgroundObjectURL = null;
                }

                if (blob) {

                    if (!(blob instanceof Blob)) {
                        customtheme.backgroundImage = null;
                        return;
                    }

                    backgroundObjectURL = URL.createObjectURL(blob);
                    customtheme.backgroundImage = backgroundObjectURL;
                } else {
                    customtheme.backgroundImage = null;
                }
            }
        );
    }

    return { loadLocalStorageSettings };
}

export function useDisableTransitions() {
    let resizeTimer;

    function disableTransitions() {
        window.addEventListener("resize", () => {
            document.body.classList.add("disable-transitions");

            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove("disable-transitions");
            }, 200);
        });
    }

    return { disableTransitions };
}

export function useDetectSaveSettings() {
    const appearance = useAppearance();
    const customtheme = useCustomtheme();
    const periods = usePeriods();
    const currentDialog = useCurrentDialog();
    const school = useSchool();
    const quickLinks = useQuickLinks();
    const id = useId();
    const notifications = useNotifications();

    let saveTimeout;

    function debouncedSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            const settings = {
            appearance: toRaw(appearance),
            customtheme: toRaw(customtheme),
            periods: toRaw(periods),
            currentDialog: currentDialog.value,
            school: school.value,
            quickLinks: toRaw(quickLinks),
            id: id.value,
            notifications: toRaw(notifications),
            };

            await idb.set("settings", settings);
        }, 200);
    }

    function detectSaveSettings() {
        watch(
            [
                appearance,
                customtheme,
                periods,
                currentDialog,
                school,
                quickLinks,
                id,
                notifications
            ],
            () => {
                debouncedSave();
            },
            { deep: true }
        );
    }

    return { detectSaveSettings };
}