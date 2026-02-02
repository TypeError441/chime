<script setup>
import { computed } from "vue";

const props = defineProps(["side"]);

import { useAppearance, useNotifications } from "../../composables/settings";
import { useApplySettings } from "../../composables/apply";

import notificationData from "../../assets/notifications.json";

import Notification from "../overlay/Notification.vue";
import WidgetWeather from "./WidgetWeather.vue";

const notificationIDs = Object.keys(notificationData).filter(id => !notificationData[id].special);

const appearance = useAppearance();
const notifications = useNotifications();

const { getTheme } = useApplySettings();

function clearAllNotifications() {
    notificationIDs.forEach(id => {
        notifications[id] = true;
    });
}

const textBrightness = computed(() => {
    const theme = getTheme();
    const value = Math.max(
        0,
        Math.min(15, Math.floor(Number(theme.imageOnBgBrightness) * 16))
    );

    const hex = value.toString(16);
    return `#${hex.repeat(6)}`;
});
</script>

<template>
<div class="overlay--notice-board-display" :class="`overlay--notice-board-display__${props.side}`">
    <button
        v-if="appearance.notificationSide === props.side && notificationIDs.filter(id => !notifications[id]).length > 1"
        class="clear-notifications notice-board-display--item glass"
        @click="clearAllNotifications"
        :style="`color: ${textBrightness}`"
    >
    Clear All
    </button>
    <Notification
        v-if="appearance.notificationSide === props.side"
        v-for="notificationID in notificationIDs"
        :id="notificationID"
        :content="notificationData[notificationID].content"
    />
    <WidgetWeather v-if="appearance.weather === props.side"/>
</div>
</template>

<style scoped type="scss">
.overlay--notice-board-display {
    position: absolute;
    display: grid;
    grid-template-columns: 7.5rem 7.5rem;
    grid-auto-rows: 2rem;
    grid-auto-flow: row dense;
    gap: 1rem;
    margin: 1rem 1rem;
    width: fit-content;
    max-height: 100vh;
    overflow-y: auto;

    .clear-notifications {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-column: span 2;
        grid-row: span 1;
        cursor: pointer;
    }

    &.overlay--notice-board-display__right {
        right: 0;
        margin: 1rem 2rem;
        direction: rtl;

        * {
            direction: ltr;
        }
    }
}
</style>