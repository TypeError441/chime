<script setup>
import { watch } from "vue";

import CustomThemeProperty from "./child/CustomThemeProperty.vue";

import { useAppearance, useCustomtheme } from "../../../composables/settings";
import { useApplySettings } from "../../../composables/apply";

const { applyTheme, applyFont } = useApplySettings();

const appearance = useAppearance();

const customtheme = useCustomtheme();
watch(() => customtheme, applyTheme, { deep: true });

function setBackground(file) {
    if (!file) {
        customtheme.backgroundBlob = null;
        return;
    }
    customtheme.backgroundBlob = file;
}
</script>

<template>
<div class="settings--item" v-if="appearance.theme == 'custom'">
    <div class="item--title">
        Custom Theme
    </div>
    <div id="item--custom-theme-creator" class="button__contrast">
        <CustomThemeProperty
            name="Background" :obj="customtheme" model="backgroundColor" type="color"
        />
        <CustomThemeProperty
            name="Background Image" :obj="customtheme" model="backgroundImage" type="file" @file="setBackground" :blob="customtheme.backgroundBlob"
        />
        <CustomThemeProperty
            name="Text" :obj="customtheme" model="color" type="color"
        />
        <CustomThemeProperty
            name="Sidebar" :obj="customtheme" model="sidebarBackgroundColor" type="color"
        />
        <CustomThemeProperty
            name="Arc" :obj="customtheme" model="radialBackgroundColor" type="color" transparency
        />
        <CustomThemeProperty
            name="Icon Brightness" :obj="customtheme" model="imageOnBgBrightness" type="number"
            :min="0" :max="1" :step="0.1"
        />
    </div>
</div>
</template>

<style scoped type="scss">
#item--custom-theme-creator {
    display: block;
    padding: 0.75em;
    margin-bottom: 1em;
    width: 80%;
    border: none;
}
</style>