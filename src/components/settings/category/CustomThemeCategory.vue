<script setup>
import { watch } from "vue";

import { useCustomtheme } from "../../../composables/settings";
import { useApplySettings } from "../../../composables/apply";

const { applyTheme, applyFont } = useApplySettings();

const customtheme = useCustomtheme();
watch(customtheme, applyTheme, { deep: true });
watch(customtheme, () => { document.documentElement.style.setProperty("--image-on-bg-brightness", customtheme.imageOnBgBrightness); }, { deep: true });


import SettingsBackgroundColorsFeature from "../feature/SettingsBackgroundColorsFeature.vue";
import SettingsBackgroundImagesFeature from "../feature/SettingsBackgroundImagesFeature.vue";
import SettingsColorFeature from "../feature/SettingsColorFeature.vue";
import SettingsRangeFeature from "../feature/SettingsRangeFeature.vue";

let template = {
    "meta": {
        "name": "Template",
        "special": true,
        "version": "2"
    },
    "background": {
        "speed": 0,
        "type": "linear",
        "colors": [
            "32, 30, 28"
        ]
    },
    "colors": {
        "text": "255, 145, 0",
        "accentColor": "61, 47, 35",
        "secondaryAccentColor": "102, 86, 75"
    },
    "useBackgroundImage": false,
    "backgroundImages": [
        {
            "path": "/background/template.png",
            "position": [0, 0],
            "scale": 1.0
        }
    ],
    "useParticles": false,
    "particles": [
        {
            "type": "leaf",
            "speed": 1.0,
            "frequency": 1
        }
    ],
    "radialTransparency": "1",
    "imageOnBgBrightness": "1"
}
</script>

<template>
<div id="settings--customtheme" class="settings--category-content">
    <div class="settings--item">
        <div class="item--title">Background</div>
        <SettingsBackgroundColorsFeature />
        <SettingsBackgroundImagesFeature />
    </div>
    <div class="settings--item">
        <div class="item--title">Text Color</div>
        <SettingsColorFeature
            v-model:color="customtheme.colors.text"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Accent Color</div>
        <SettingsColorFeature
            v-model:color="customtheme.colors.accentColor"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Accent Color 2</div>
        <SettingsColorFeature
            v-model:color="customtheme.colors.secondaryAccentColor"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Icon Brightness</div>
        <SettingsRangeFeature
            :min="0"
            :max="1"
            :step="0.01"
            v-model="customtheme.imageOnBgBrightness"
            label="percent"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Arc Transparency</div>
        <SettingsRangeFeature
            :min="0"
            :max="1"
            :step="0.01"
            v-model="customtheme.radialTransparency"
            label="percent"
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