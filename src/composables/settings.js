import { ref, reactive } from "vue";

import { createDefaultAppearance, createDefaultCustomtheme, createDefaultSchool, createDefaultQuickLinks } from "./default";

const appearance = reactive(createDefaultAppearance());

const customtheme = reactive(createDefaultCustomtheme());

const sidebarOpened = ref(false);
const school = ref(createDefaultSchool());

const stats = reactive({
    now: Date.now(),
    time: 0,
    tune: -4,
    percent: 0,
    period: reactive({
        start: [0, 0],
        end: [24, 0],
        name: "Free"
    }),
    schedule: "Normal"
});

const periods = reactive({});

const quickLinks = reactive(createDefaultQuickLinks());

const id = ref(-1);

const notifications = reactive({});

export function useAppearance() {
    return appearance;
}

export function useCustomtheme() {
    return customtheme;
}

export function useSidebarOpened() {
    return sidebarOpened;
}

export function useSchool() {
    return school;
}

export function useStats() {
    return stats;
}

export function usePeriods() {
    return periods;
}

export function useQuickLinks() {
    return quickLinks;
}

export function useId() {
    return id;
}

export function useNotifications() {
    return notifications;
}