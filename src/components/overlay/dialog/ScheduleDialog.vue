<script setup>
import { useStats, useSchool, useCurrentDialog } from "../../../composables/settings";
import { ref, watch } from "vue";

import SettingsDropdownFeature from "../../settings/feature/SettingsDropdownFeature.vue";
import ScheduleCalendar from "../../schedule/ScheduleCalendar.vue";
import CloseDialog from "../CloseDialog.vue";

const stats = useStats();
const schoolName = useSchool();
const currentDialog = useCurrentDialog();

const schedules = ref({});

watch(schoolName, async () => {
    const calendars = import.meta.glob("../../../assets/calendars/*.json");

    const loader = calendars[`../../../assets/calendars/${schoolName.value}.json`];
    if (!loader) throw new Error("calendar not found");
    const data = (await loader()).default;

    schedules.value = data.schedules;
}, { immediate: true });

</script>

<template>
<dialog id="overlay--dialog__schedule" class="overlay--dialog glass" :class="{open: currentDialog == 'schedule'}" :open="currentDialog == 'schedule'">
    <h1 id="sidebar--title">Schedule</h1>
    <CloseDialog />
    <SettingsDropdownFeature
        id="schedule--select"
        :optionIDs="Object.keys(schedules)"
        :options="schedules"
        name="none"
        v-model="stats.schedule"
    />
    <ScheduleCalendar />
</dialog>
</template>

<style scoped type="scss">
#overlay--dialog__schedule.open {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    min-width: 400px;
    color: rgb(var(--color));

    #schedule--select {
        width: 80%;
        margin-bottom: 2rem;
    }

    #sidebar--title {
        font-size: max(2vw, 2em);
        font-weight: bold;
        flex-grow: 0;
        text-align: left;
    }

    @media ( max-width: 600px ) {
        & {
            min-width: 100%;
        }
    }
}
</style>