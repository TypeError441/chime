import { ref, computed, watch } from "vue";
import { useStats, usePeriods, useSchool } from "./settings";

const interval = ref(null);

const stats = useStats();
const periods = usePeriods();
const school = useSchool();
const schoolData = ref(null);

const periodsAndTime = computed(() => {
    if (!schoolData.value || !stats.schedule) return {start: [0, 0], end: [24, 0], name: "Free"};

    const minutesSinceMidnight = stats.now.getHours() * 60 + stats.now.getMinutes();

    const periods = schoolData.value.schedules[stats.schedule].periods;

    let currentPeriod = periods.find(p => {
        const startMinutes = p.start[0] * 60 + p.start[1];
        const endMinutes = p.end[0] * 60 + p.end[1];
        return minutesSinceMidnight >= startMinutes && minutesSinceMidnight < endMinutes;
    });

    if (!currentPeriod) {
        const nextPeriod = periods.find(period => {
            const periodStart = period.start[0] * 60 + period.start[1];
            return periodStart > minutesSinceMidnight;
        });

        if (nextPeriod === undefined) {
            currentPeriod = {
                start: periods[periods.length - 1].end,
                end: [24, 0],
                name: "Free"
            };
        }

        else {
            let previousPeriod = periods[periods.indexOf(nextPeriod) - 1];

            currentPeriod = {
                start: previousPeriod.end,
                end: nextPeriod.start,
                name: "Passing to " + nextPeriod.name
            };
        }
    }

    let periodStart = new Date(stats.now.getFullYear(), stats.now.getMonth(), stats.now.getDate(), currentPeriod.start[0], currentPeriod.start[1], 0);
    let periodEnd = new Date(stats.now.getFullYear(), stats.now.getMonth(), stats.now.getDate(), currentPeriod.end[0], currentPeriod.end[1], 0);
    let periodDuration = periodEnd - periodStart;
    let periodRemaining = periodEnd - stats.now;
    let periodPercentage = periodRemaining / periodDuration;

    let faviconColor;
    if (periodRemaining >= 15 * 60 * 1000) {
        faviconColor = "green";
    }
    else if (periodRemaining >= 5 * 60 * 1000) {
        faviconColor = "yellow";
    }
    else if (periodRemaining >= 2 * 60 * 1000) {
        faviconColor = "orange";
    }
    else if (periodRemaining < 2 * 60 * 1000) {
        faviconColor = "red";
    }
    else {
        faviconColor = "gray";
    }
    
    document.querySelector("link[rel='icon']").href = `/favicon/${faviconColor}`;

    return [currentPeriod, periodRemaining, periodPercentage];
});

watch(periodsAndTime, ([currentPeriod, remaining, percentage]) => {
    stats.time = remaining;
    stats.period.start = currentPeriod.start;
    stats.period.end = currentPeriod.end;
    stats.period.name = currentPeriod.name;
    stats.percent = percentage;

    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
        let color;
        if (remaining >= 15 * 60 * 1000) color = "green";
        else if (remaining >= 5 * 60 * 1000) color = "yellow";
        else if (remaining >= 2 * 60 * 1000) color = "orange";
        else if (remaining < 2 * 60 * 1000) color = "red";
        else color = "gray";

        favicon.href = `/favicon/${color}.png`;
    }
});

async function loadCalendar() {
    if (!school.value) return;

    const calendars = import.meta.glob("../assets/calendars/*.json");

    const loader = calendars[`../assets/calendars/${school.value}.json`];
    if (!loader) throw new Error("calendar not found");
    schoolData.value = (await loader()).default;

    let override = schoolData.value.overrides[`${stats.now.getMonth() + 1}-${stats.now.getDate()}`];
    if (override) {
        stats.schedule = override;
    }
    else {
        stats.schedule = schoolData.value.calendar[stats.now.getDay()];
    }
}
watch(() => school.value, loadCalendar, { immediate: true });

export function step() {
    stats.now = new Date(Date.now() - stats.tune * 1000);
}

export function tick() {
    if (interval.value) return;

    step();
    interval.value = setInterval(step, 1000);
}

export function stopTick() {
    clearInterval(interval.value);
    interval.value = null;
}

export function parsePeriod(str) {
    return str.replace(/Period\s+(\d+)/gi, (match, num) => {
        const index = Number(num);
        const name = periods[`period${index}`];

        if (typeof name === "string" && name.trim() !== "") {
            return name;
        }

        return match;
    });
}