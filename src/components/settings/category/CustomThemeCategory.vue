<script setup>
import { watch, computed } from "vue";

import { useAppearance, useCustomtheme } from "../../../composables/settings";
import { useApplySettings } from "../../../composables/apply";

const { applyTheme, applyFont } = useApplySettings();

const appearance = useAppearance();
const customtheme = useCustomtheme();
watch(() => customtheme, applyTheme, { deep: true });

const radialTransparency = computed({
    get: () => appearance.pie ? customtheme.radialTransparency : undefined,
    set: (value) => { if (appearance.pie) customtheme.radialTransparency = value; }
});

import SettingsColorFeature from "../feature/SettingsColorFeature.vue";
import SettingsRangeFeature from "../feature/SettingsRangeFeature.vue";
import SettingsBoolFeature from "../feature/SettingsBoolFeature.vue";
import SettingsImageFeature from "../feature/SettingsImageFeature.vue";
</script>

<template>
<div id="settings--customtheme" class="settings--category-content">
    <div class="settings--item">
        <div class="item--title">Background Color</div>
        <SettingsColorFeature
            v-model:color="customtheme.backgroundColor"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Text Color</div>
        <SettingsColorFeature
            v-model:color="customtheme.color"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Accent Color</div>
        <SettingsColorFeature
            v-model:color="customtheme.sidebarBackgroundColor"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Accent Color 2</div>
        <SettingsColorFeature
            v-model:color="customtheme.radialBackgroundColor"
            v-model:transparency="radialTransparency"
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
        <div class="item--title">Background Image</div>
        <!-- <SettingsBoolFeature
            v-model="customtheme.useBackgroundImage"
        />
        <div v-if="customtheme.useBackgroundImage">
            
        </div> -->
        <SettingsImageFeature
            v-model="customtheme.backgroundBlob"
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