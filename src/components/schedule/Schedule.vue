<script setup>
import { useStats, useSchool } from "../../composables/settings";
import { ref, watch } from "vue";

import SettingsDropdownFeature from "../settings/feature/SettingsDropdownFeature.vue";
import ScheduleCalendar from "./ScheduleCalendar.vue";

const stats = useStats();
const schoolName = useSchool();

const schedules = ref({});

watch(schoolName, async () => {
    const calendars = import.meta.glob("../../assets/calendars/*.json");

    const loader = calendars[`../../assets/calendars/${schoolName.value}.json`];
    if (!loader) throw new Error("calendar not found");
    const data = (await loader()).default;

    schedules.value = data.schedules;
}, { immediate: true });

</script>

<template>
<div id="schedule" class="glass">
    <h1 class="item--title">Schedule</h1>
    <SettingsDropdownFeature
        id="schedule--select"
        :optionIDs="Object.keys(schedules)"
        :options="schedules"
        name="none"
        v-model="stats.schedule"
    />
    <ScheduleCalendar />
</div>
</template>

<style scoped type="scss">
#schedule {
    --glass-color: var(--sidebar-background-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: max(400px, 30vw);
    height: 75vh;
    margin-bottom: calc(25vh * 3/5);
    border-radius: 1rem;

    #schedule--select {
        width: 80%;
        margin-bottom: 2rem;
    }
}
</style>