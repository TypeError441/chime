<script setup>
import { watch, nextTick, onMounted, computed } from "vue";

import { useSidebarOpened, useStats } from "../../composables/settings";

const props = defineProps({
    top: Number,
    timeLabel: String,
    current: Boolean
});

const sidebarOpened = useSidebarOpened();
const stats = useStats();
const schedule = computed(() => stats.schedule);

watch(sidebarOpened, (newVal) => {
    if (newVal) {
        scrollIntoView();
    }
});

watch(schedule, (newVal) => {
    if (newVal) {
        scrollIntoView();
    }
});

onMounted(() => {
    scrollIntoView();
});

function scrollIntoView() {
    nextTick(() => {
        if (props.current) {
            const el = document.querySelector('.schedule--indicator__current');
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    });
}

</script>

<template>
    <div
        class="schedule--indicator"
        :class="{ 'schedule--indicator__current': props.current }"
        :style="{ top: `${props.top}px` }"
    >
        <div class="indicator--time">{{ props.timeLabel }}</div>
    </div>
</template>

<style scoped type="scss">
.schedule--indicator {
    position: absolute;
    right: 0;
    width: 97%;
    background-color: rgb(var(--background-color));
    opacity: 0.5;
    z-index: 2;

    &.schedule--indicator__current {
        height: 2px;
        background-color: red;
        opacity: 1;
        z-index: 10;

        .indicator--time {
            background-color: red;
            color: white;
        }
    }

    .indicator--time {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        width: fit-content;
        background-color: rgb(var(--background-color));
        color: rgb(var(--color));
        font-size: 0.8rem;
        padding: 0.1rem 0.4rem;
        border-radius: 2em;
    }
}
</style>