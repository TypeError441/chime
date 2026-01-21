<script setup>
import { computed, ref, watch } from "vue";

import { useStats, useSchool } from "../../composables/settings";
import { parsePeriod } from "../../composables/tick";

import CalendarItem from "./CalendarItem.vue";
import CalendarTimeIndicator from "./CalendarTimeIndicator.vue";

const stats = useStats();
const schoolName = useSchool();

const schedules = ref(null);
const currentSchedule = ref(null);

function calculateTimeString(period, format) {
    let startHour = period.start[0] == 0 ? 12 : (period.start[0] > 12 ? period.start[0] - 12 : period.start[0]);
    let startMinute = `${period.start[1]}`.padStart(2, "0");
    let startIsAM = period.start[0] > 11 && period.start[0] < 24 ? "PM" : "AM";

    if (format == 0) {
        return `${startHour}:${startMinute} ${startIsAM}`;
    }

    if (format == 2) {
        return `${startHour}:${startMinute}`;
    }

    let endHour = period.end[0] == 0 ? 12 : (period.end[0] > 12 ? period.end[0] - 12 : period.end[0]);
    let endMinute = `${period.end[1]}`.padStart(2, "0");
    let endIsAM = period.end[0] > 11 && period.end[0] < 24 ? "PM" : "AM";

    return `${startHour}:${startMinute} ${startIsAM} - ${endHour}:${endMinute} ${endIsAM}`;
}
watch(schoolName, async () => {
    const calendars = import.meta.glob("../../assets/calendars/*.json");

    const loader = calendars[`../../assets/calendars/${schoolName.value}.json`];
    if (!loader) throw new Error("calendar not found");
    const data = (await loader()).default;

    schedules.value = data.schedules;
    currentSchedule.value = schedules.value[stats.schedule];
}, { immediate: true });

const firstBlockStart = computed(() => {
    if (!currentSchedule.value) return 0;
    let firstPeriod = currentSchedule.value.periods[0];
    if (firstPeriod.name === "Free" && currentSchedule.value.periods.length > 1) {
        firstPeriod = currentSchedule.value.periods[1];
    }
    return firstPeriod.start[0] * 60 + firstPeriod.start[1];
});

watch(() => stats.schedule, (newSchedule) => {
    if (schedules.value) {
        currentSchedule.value = schedules.value[newSchedule];
    }
});

function blockStart(period) {
    return period.start[0] * 60 + period.start[1];
}

function blockEnd(period) {
    return period.end[0] * 60 + period.end[1];
}

const currentTime = computed(() => {
    return stats.now.getHours() * 60 + stats.now.getMinutes();
});

const displayedPeriods = computed(() => {
    if (!currentSchedule.value) return [];

    const periods =
        currentSchedule.value.periods[0].name === "Free" &&
        currentSchedule.value.periods.length > 1
        ? currentSchedule.value.periods.slice(1)
        : currentSchedule.value.periods;

    return periods.map((p) => {
        const start = blockStart(p);
        const end = blockEnd(p);

        return {
            ...p,
            top: (start - firstBlockStart.value) * 2,
            height: Math.max(27.3, ((end - start) * 2) - 5),
            displayName: parsePeriod(p.name),
            timeLabel: calculateTimeString(p, 1),
        };
    });
});

const indicatorTop = computed(
    () => (currentTime.value - firstBlockStart.value) * 2
);

const indicatorLabel = computed(() =>
    calculateTimeString(
        { start: [stats.now.getHours(), stats.now.getMinutes()] },
        2
    )
);

const showIndicator = computed(() => {
    if (!currentSchedule.value) return false;
    const last = currentSchedule.value.periods.at(-1);
    return (
        currentTime.value <= blockEnd(last) &&
        currentTime.value >= firstBlockStart.value
    );
});

const calendarHeight = computed(() => {
    if (!displayedPeriods.value.length) return 0;
    const last = displayedPeriods.value.at(-1);
    return last.top + last.height + 80;
});
</script>

<template>
    <div v-if="currentSchedule" class="schedule--calendar">
        <CalendarItem
            v-for="period in displayedPeriods"
            :key="period.name"
            :period="period"
            :top="period.top"
            :height="period.height"
            :displayName="period.displayName"
            :timeLabel="period.timeLabel"
        />

        <div
            class="calendar--spacer"
            :style="{ height: calendarHeight + 'px' }"
        >
        </div>

        <CalendarTimeIndicator
            v-if="showIndicator"
            :top="indicatorTop"
            :timeLabel="indicatorLabel"
            :current="true"
        />

        <CalendarTimeIndicator
            v-for="hour in Math.ceil((blockEnd(currentSchedule.periods.at(-1)) - firstBlockStart) / 60)"
            :key="hour"
            :top="(((hour * 60) - (firstBlockStart % 60)) * 2)"
            :timeLabel="(() => {
                const minutes = firstBlockStart + hour * 60;
                const h = Math.floor(minutes / 60) % 12;
                return `${h === 0 ? 12 : h}:00`;
            })()"
            :current="false"
        />
    </div>
</template>

<style scoped type="scss">
.schedule--calendar {
    position: relative;
    width: 90%;
    flex-grow: 1;
    overflow-y: auto;

    .calendar-spacer {
        width: 1px;
        pointer-events: none;
    }
}
</style>