<script setup>
import { ref, computed } from "vue";

import { useAppearance, useCustomtheme, useNotifications, useQuickLinks, useSidebarOpened } from "../../composables/settings";
import notificationData from "../../assets/notifications.json";
import themes from "../../assets/themes.json";

import OverlayButton from "../overlay/OverlayButton.vue";
import Notification from "../overlay/Notification.vue";
import WidgetQuickLink from "../overlay/WidgetQuickLink.vue";
import WidgetWeather from "./WidgetWeather.vue";
import FeedbackModal from "./FeedbackModal.vue";

const notificationIDs = Object.keys(notificationData).filter(id => !notificationData[id].hidden);

const appearance = useAppearance();
const customtheme = useCustomtheme();
const notifications = useNotifications();
const quickLinks = useQuickLinks();
const sidebarOpened = useSidebarOpened();

const feedbackOpened = ref(false);

function openFeedback() {
    feedbackOpened.value = true;
}

function closeFeedback() {
    feedbackOpened.value = false;
}

function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value;
}

function clearAllNotifications() {
    notificationIDs.forEach(id => {
        notifications[id] = true;
    });
}

const textBrightness = computed(() => {
    const theme = appearance.theme === "custom" ? customtheme : themes[appearance.theme];
    const value = Math.max(
        0,
        Math.min(15, Math.floor(Number(theme.imageOnBgBrightness) * 16))
    );

    const hex = value.toString(16);
    return `#${hex.repeat(6)}`;
});
</script>

<template>
<div id="overlay">
    <div class="overlay--grid overlay--grid__left">
        <button
            v-if="appearance.notificationSide == 'left' && notificationIDs.filter(id => !notifications[id]).length > 1"
            class="clear-notifications overlay--item"
            @click="clearAllNotifications"
            :style="`color: ${textBrightness}`"
        >
        Clear All
        </button>
        <Notification
            v-if="appearance.notificationSide == 'left'"
            v-for="notificationID in notificationIDs"
            :id="notificationID"
            :content="notificationData[notificationID].content"
        />

        <OverlayButton func="feedback" @feedback="openFeedback" v-if="appearance.feedbackButton == 'left'" />
        <OverlayButton func="sidebar" @sidebar="toggleSidebar" v-if="appearance.sidebarButton == 'left'" />
        <WidgetWeather v-if="appearance.weather == 'left'"/>
        <WidgetQuickLink
            v-for="link in quickLinks.filter(quickLink => quickLink.side == 'left')"
            :key="link.id"
            :title="link.title"
            :url="link.url"
        />
    </div>
    <div class="overlay--grid overlay--grid__right">
        <button
            v-if="appearance.notificationSide == 'right' && notificationIDs.filter(id => !notifications[id]).length > 1"
            class="clear-notifications overlay--item"
            @click="clearAllNotifications"
            :style="`color: ${textBrightness}`"
        >
        Clear All
        </button>
        <Notification
            v-if="appearance.notificationSide == 'right'"
            v-for="notificationID in notificationIDs"
            :id="notificationID"
            :content="notificationData[notificationID].content"
        />

        <OverlayButton func="feedback" @feedback="openFeedback" v-if="appearance.feedbackButton == 'right'" />
        <OverlayButton func="sidebar" @sidebar="toggleSidebar" v-if="appearance.sidebarButton == 'right'" />
        <WidgetWeather v-if="appearance.weather == 'right'"/>
        <WidgetQuickLink
            v-for="link in quickLinks.filter(quickLink => quickLink.side == 'right')"
            :key="link.id"
            :title="link.title"
            :url="link.url"
        />
    </div>
    <div id="overlay--panel" v-if="feedbackOpened">
        <FeedbackModal v-if="feedbackOpened" @close="closeFeedback"/>
    </div>
</div>
</template>

<style scoped type="scss">
#overlay {
    position: fixed;
    z-index: 100;
    top: 0;
    width: inherit;
    pointer-events: none;

    #overlay--panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 50;
        pointer-events: all;
        background-color: #000a;
    }

    .overlay--grid {
        position: absolute;
        display: grid;
        grid-template-columns: 2rem 2rem 2rem 2rem 2rem 2rem;
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
            grid-column: span 6;
            grid-row: span 1;
            cursor: pointer;
        }

        &.overlay--grid__right {
            right: 0;
            margin: 1rem 2rem;
            direction: rtl;

            * {
                direction: ltr;
            }
        }
    }
}
</style>