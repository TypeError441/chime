<script setup>
import { useAppearance, useQuickLinks } from "../../../composables/settings";

import SettingsBoolFeature from "../feature/SettingsBoolFeature.vue";
import SettingsRadioFeature from "../feature/SettingsRadioFeature.vue"
import SettingsQuickLinkFeature from "../feature/SettingsQuickLinkFeature.vue";

const appearance = useAppearance();
const quickLinks = useQuickLinks();
</script>

<template>
<div id="settings--pinned" class="settings--category-content">
    <div class="settings--item">
        <div class="item--title">Weather</div>
        <SettingsRadioFeature
            id="weather"
            v-model="appearance.weather"
            :values="{left: 'Left', right: 'Right', off: 'Off'}"
        />
        <div class="item--subtitle" v-if="appearance.weather !== 'off'">Unit</div>
        <SettingsRadioFeature
            v-if="appearance.weather !== 'off'"
            id="weather-unit"
            v-model="appearance.weatherUnit"
            :values="{f: '°F', c: '°C'}"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Notifications</div>
        <SettingsRadioFeature
            id="notification-side"
            v-model="appearance.notificationSide"
            :values="{left: 'Left', right: 'Right'}"
        />
    </div>
    <div class="settings--item">
        <div class="item--title">Quick Links</div>
        <div class="item--subtitle">Open in New Tab</div>
        <SettingsBoolFeature
            v-model="appearance.newtabquicklinks"
        />
        <div id="item--quick-links">
            <button id="item--add-quick-link" class="button button__success glass" @click="quickLinks.push({ title: 'Chime', url: 'https://chimewebsite.netlify.app/', side: 'right'})">+ Add</button>
            <SettingsQuickLinkFeature
                v-for="(link, index) in quickLinks"
                :id="`item--quick-link__${index}`"
                :index="index"
                :quick-link="link"
            />
        </div>
    </div>
</div>
</template>

<style scoped type="scss">
#item--quick-links {
    margin-top: 1rem;

    #item--add-quick-link {
        color: white;
        width: fit-content;
        padding: 0 2rem;
        height: 3rem;
    }
}
</style>