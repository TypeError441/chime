<script setup>
import { ref } from "vue";

import { useAppearance } from "../../../composables/settings";

import ToggleSettingsItem from "../ToggleSettingsItem.vue";
import BoolFeature from "./child/BoolFeature.vue";
import RangeFeature from "./child/RangeFeature.vue";
import RadioFeature from "./child/RadioFeature.vue";

const appearance = useAppearance();

const hidden = ref(true);
</script>

<template>
<div class="settings--item">
    <div class="item--title">
        Features
    </div>
    <ToggleSettingsItem v-model="hidden" />
    <div v-if="!hidden">
        <BoolFeature
            display="Open Quick Links in New Tab"
            v-model="appearance.newtabquicklinks"
        />
        <BoolFeature
            display="Arc"
            v-model="appearance.pie"
        />
        <RangeFeature
            v-if="appearance.pie"
            display="Arc Size"
            v-model="appearance.piesize"
            :min="30"
            :max="200"
        />
        <RadioFeature
            display="Weather"
            id="weather"
            v-model="appearance.weather"
            :values="{left: 'Left', right: 'Right', off: 'Off'}"
        />
        <RadioFeature
            display="Sidebar Button"
            id="sidebarButton"
            v-model="appearance.sidebarButton"
            :values="{left: 'Left', right: 'Right', off: 'Off'}"
        />
        <RadioFeature
            display="Feedback Button"
            id="feedbackButton"
            v-model="appearance.feedbackButton"
            :values="{left: 'Left', right: 'Right', off: 'Off'}"
        />
        <RadioFeature
            display="Notifications"
            id="notificationSide"
            v-model="appearance.notificationSide"
            :values="{left: 'Left', right: 'Right'}"
        />
    </div>
</div>
</template>

<style scoped type="scss">
</style>