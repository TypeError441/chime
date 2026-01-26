<script setup>
import { computed } from "vue";

import { useAppearance, useQuickLinks, useStats, useCurrentDialog } from "../../composables/settings";
import { parsePeriod } from "../../composables/tick";

import RadialTimer from "./RadialTimer.vue";
import PinnedButton from "./PinnedButton.vue";
import WidgetQuickLink from "./WidgetQuickLink.vue";

const appearance = useAppearance();
const quickLinks = useQuickLinks();
const stats = useStats();
const currentDialog = useCurrentDialog();

const parsedPeriod = computed(() => {
    return parsePeriod(stats.period.name);
});

const timeStr = computed(() => {
    const totalSeconds = Math.round(stats.time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.title = `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")} | ${parsedPeriod.value}, ${stats.schedule}`;
    return `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
});
</script>

<template>
<main id="dashboard">
    <div id="dashboard--visual">
        <RadialTimer v-if="appearance.pie"/>
        <div id="visual--status">
            <div id="status--time">{{ timeStr }}</div>
            <div id="status--period">{{ parsedPeriod }}</div>
            <div id="status--schedule">{{ stats.schedule }}</div>
        </div>
    </div>
    <div id="dashboard--pinned" class="glass">
        <PinnedButton func="Settings" @click="() => currentDialog = 'settings'" />
        <PinnedButton func="Schedule" @click="() => currentDialog = 'schedule'" />
        <WidgetQuickLink
            v-for="link in quickLinks"
            :key="link.id"
            :title="link.title"
            :url="link.url"
        />
        <PinnedButton func="Feedback" @click="() => currentDialog = 'feedback'" />
    </div>
</main>
</template>

<style scoped type="scss">
#dashboard {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: 100vh;

    #dashboard--visual {
        #visual--status {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgb(var(--color));
            width: 95%;
            max-width: 95vh;

            #status--time {
                font-size: 24vmin;
                text-align: center;
                transition: font-size 0.4s cubic-bezier(0.76, 0, 0.24, 1);
            }

            #status--period, #status--schedule {
                font-size: 10vmin;
                transition: font-size 0.4s cubic-bezier(0.76, 0, 0.24, 1);

                &#status--schedule {
                    opacity: 0.6;
                }
            }
        }
    }

    #dashboard--pinned {
        --glass-color: var(--sidebar-background-color);
        z-index: 999;
        position: absolute;
        bottom: 2rem;
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        max-width: calc(100vw - 4rem);
        backdrop-filter: blur(0px);
    }
}
</style>