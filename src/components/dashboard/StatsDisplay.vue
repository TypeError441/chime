<script setup>
import { computed } from "vue";
import { useSidebarOpened, useStats } from "../../composables/settings";

import { parsePeriod } from "../../composables/tick";

const sidebarOpened = useSidebarOpened();
const stats = useStats();

const parsedPeriod = computed(() => {
    return parsePeriod(stats.period.name);
});

const timeStr = computed(() => {
    const hours = Math.floor(stats.time / 1000 / 60 / 60);
    const minutes = `${Math.floor(stats.time / 1000 / 60) % 60}`.padStart(2, "0");
    const seconds = `${Math.round(stats.time / 1000) % 60}`.padStart(2, "0");

    document.title = `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds} | ${stats.period.name}, ${stats.schedule}`;
    return `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds}`;
});
</script>

<template>
<div class="stats-display" :class="{'sidebar-opened': sidebarOpened}">
    <div class="time">{{ timeStr }}</div>
    <div class="period">{{ parsedPeriod }}</div>
    <div class="schedule">{{ stats.schedule }}</div>
</div>
</template>

<style scoped type="scss">
.stats-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgb(var(--color));
    width: 95%;
    max-width: 95vh;

    .time {
        font-size: 24vmin;
        text-align: center;
        transition: font-size 0.4s cubic-bezier(0.76, 0, 0.24, 1);
    }

    .period, .schedule {
        font-size: 16vmin;
        transition: font-size 0.4s cubic-bezier(0.76, 0, 0.24, 1);
    }
}
</style>