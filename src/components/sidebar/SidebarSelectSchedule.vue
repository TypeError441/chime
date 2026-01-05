<script setup>
import { useStats, useSchool } from "../../composables/settings";
import { ref, watch } from "vue";

const stats = useStats();
const schoolName = useSchool();

const schedules = ref(null);

watch(schoolName, async () => {
    const calendars = import.meta.glob("../../assets/calendars/*.json");

    const loader = calendars[`../../assets/calendars/${schoolName.value}.json`];
    if (!loader) throw new Error("calendar not found");
    const data = (await loader()).default;

    schedules.value = data.schedules;
}, { immediate: true });
</script>

<template>
<select name="select-schedule" id="select-schedule" class="button button__contrast" v-model="stats.schedule">
    <option
        v-for="(scheduleDetails, scheduleName) in schedules"
        :id="scheduleName"
        :value="scheduleName"
        :hidden="scheduleDetails.special"
    >
    {{ scheduleName }}
    </option>
</select>
</template>

<style scoped type="scss">
#select-schedule {
    margin: 1em 0;
    width: 90%;
}
</style>