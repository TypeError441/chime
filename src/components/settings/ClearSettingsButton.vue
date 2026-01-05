<script setup>
import { ref, computed } from "vue";

import { useAppearance, useCustomtheme, usePeriods, useSchool, useQuickLinks } from "../../composables/settings";
import { createDefaultAppearance, createDefaultCustomtheme, createDefaultSchool, createDefaultQuickLinks } from "../../composables/default";

const appearance = useAppearance();
const customtheme = useCustomtheme();
const periods = usePeriods();
const school = useSchool();
const quickLinks = useQuickLinks();

const defaultAppearance = createDefaultAppearance();
const defaultCustomtheme = createDefaultCustomtheme();
const defaultSchool = createDefaultSchool();
const defaultQuickLinks = createDefaultQuickLinks();

function clearSettings() {
    if (level.value == 0) {
        level.value = 1;
        return;
    }

    Object.assign(appearance, defaultAppearance);
    Object.assign(customtheme, defaultCustomtheme);
    periods.value = {};
    school.value = defaultSchool;
    quickLinks.value = defaultQuickLinks;
    level.value = 0;
}

const level = ref(0);
</script>

<template>
<button id="settings--clear-settings" class="button__contrast" @click="clearSettings">{{ level == 0 ? "Clear Settings" : "Are you sure?" }}</button>
</template>

<style scoped type="scss">
#settings--clear-settings {
    padding: 0.5em;
    border: none;
    cursor: pointer;
}
</style>