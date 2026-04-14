<script setup>
import { ref, watch } from "vue";

import themes from "../../../assets/themes.json";
import fonts from "../../../assets/fonts.json";

import SettingsDropdownFeature from "../feature/SettingsDropdownFeature.vue";
import SettingsBoolFeature from "../feature/SettingsBoolFeature.vue";
import SettingsRangeFeature from "../feature/SettingsRangeFeature.vue";

import { useAppearance, useCustomtheme, useCurrentDialog } from "../../../composables/settings";
import { useApplySettings } from "../../../composables/apply";

const themeIDs = ref(Object.keys(themes));
const fontIDs = ref(Object.keys(fonts));

const { applyTheme, applyFont } = useApplySettings();

const appearance = useAppearance();
watch(() => appearance.theme, applyTheme);
watch(() => appearance.font, applyFont);

const customtheme = useCustomtheme();
watch(() => customtheme, applyTheme, { deep: true });

const currentDialog = useCurrentDialog();
</script>

<template>
<div id="settings--appearance" class="settings--category-content">
    <div class="settings--item">
        <div class="item--title">Theme</div>
        <SettingsDropdownFeature
            v-model="appearance.theme"
            :optionIDs="themeIDs"
            :options="themes"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Font</div>
        <SettingsDropdownFeature
            v-model="appearance.font"
            :optionIDs="fontIDs"
            :options="fonts"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Arc</div>
        <SettingsBoolFeature v-model="appearance.pie" />
    </div>
    <div class="settings--item"
        v-if="appearance.pie"
    >
        <div class="item--title">Arc Size</div>
        <SettingsRangeFeature
            v-model="appearance.piesize"
            :min="30"
            :max="300"
        />
    </div>
</div>
</template>

<style scoped>
.edit-custom-theme {
    margin-top: 0.5rem;
    width: 100%;
}
</style>