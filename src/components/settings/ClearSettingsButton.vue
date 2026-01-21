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
    
    Object.keys(periods).forEach(period => {
        delete periods[period];
    });

    school.value = defaultSchool;

    quickLinks.splice(0, quickLinks.length);
    defaultQuickLinks.forEach(quickLink => {
        quickLinks.push(quickLink);
    });

    level.value = 0;
}

const level = ref(0);
</script>

<template>
<div id="settings--clear-settings" class="glass glass__child categories--option" @click="clearSettings">{{ level == 0 ? "Clear Settings" : "Are you sure?" }}</div>
</template>

<style scoped type="scss">
#settings--clear-settings {
    margin-top: auto;
}
</style>