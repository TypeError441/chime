<script setup>
import { computed } from "vue";

import { useAppearance, useStats } from "../../composables/settings";
import { parsePeriod } from "../../composables/tick";

import RadialTimer from "../dashboard/RadialTimer.vue";

const appearance = useAppearance();
const stats = useStats();

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
<div id="dashboard">
    <RadialTimer v-if="appearance.pie"/>
    <div id="dashboard--status">
        <div id="status--time">{{ timeStr }}</div>
        <div id="status--period">{{ parsedPeriod }}</div>
        <div id="status--schedule">{{ stats.schedule }}</div>
    </div>
</div>
</template>

<style scoped type="scss">
#dashboard {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    flex: 0 0 100vh;

    #dashboard--status {
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
</style>