<script setup>
import { ref, watch } from "vue";

import themes from "../../assets/themes.json";
import fonts from "../../assets/fonts.json";
import pkg from "../../../package.json";

import DropdownSettingsItem from "./item/DropdownSettingsItem.vue";
import TuneSettingsItem from "./item/TuneSettingsItem.vue";
import FeaturesSettingsItem from "./item/FeaturesSettingsItem.vue";
import CustomThemeCreatorSettingsItem from "./item/CustomThemeCreatorSettingsItem.vue";
import PeriodNamesSettingsItem from "./item/PeriodNamesSettingsItem.vue";
import CustomQuickLinkSettingsItem from "./item/CustomQuickLinkSettingsItem.vue";
import ClearSettingsButton from "../settings/ClearSettingsButton.vue";
import ResetNotificationsButton from "../settings/ResetNotificationsButton.vue";

import { useAppearance, useCustomtheme } from "../../composables/settings";
import { useApplySettings } from "../../composables/apply";

const themeIDs = ref(Object.keys(themes));
const fontIDs = ref(Object.keys(fonts));
const version = ref(pkg.version);

const { applyTheme, applyFont } = useApplySettings();

const appearance = useAppearance();
watch(() => appearance.theme, applyTheme);
watch(() => appearance.font, applyFont);

const customtheme = useCustomtheme();
watch(() => customtheme, applyTheme, { deep: true });
</script>

<template>
<div id="settings">
    <h1 id="settings--title">Settings</h1>
    <div id="settings--content">
        <DropdownSettingsItem
            name="Theme"
            v-model="appearance.theme"
            :optionIDs="themeIDs"
            :options="themes"
            hidden="secret"
        />
        <DropdownSettingsItem
            name="Font"
            v-model="appearance.font"
            :optionIDs="fontIDs"
            :options="fonts"
            hidden="hidden"
        />
        <TuneSettingsItem />
        <FeaturesSettingsItem />
        <CustomThemeCreatorSettingsItem />
        <PeriodNamesSettingsItem />
        <CustomQuickLinkSettingsItem />
    </div>
    <div id="settings--corner">
        <ResetNotificationsButton />
        <ClearSettingsButton />
        <p id="version">Version {{ version }}</p>
    </div>
</div>
</template>

<style scoped type="scss">
#settings {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: fit-content;
    color: rgb(var(--color));

    #settings--title {
        margin: 2rem;
        font-size: 8vmin;
        font-weight: bold;
        text-align: center;
    }

    #settings--content {
        width: 65%;
        flex-grow: 1;
        columns: 3;
        padding: 1em 0;
    }

    #settings--corner {
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0.5em;
        display: flex;
        flex-direction: column;

        #version {
            margin: 0em;
        }
    }
}
</style>