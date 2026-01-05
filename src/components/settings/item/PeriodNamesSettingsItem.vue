<script setup>
import { computed, ref } from "vue";

import { usePeriods, useSchool } from "../../../composables/settings";
import ToggleSettingsItem from "../ToggleSettingsItem.vue";

const periodNames = usePeriods();

const school = useSchool();

const calendars = import.meta.glob("../../../assets/calendars/*.json");

const periods = computed(async () => {
    const loader = calendars[`../../../assets/calendars/${school.value}.json`];
    if (!loader) throw new Error("calendar not found");
    const data = (await loader()).default;
    return data.periods;
});

const hidden = ref(true);
</script>

<template>
<div class="settings--item">
    <div class="item--title">
        Period Names
    </div>
    <ToggleSettingsItem v-model="hidden" />
    <div v-if="!hidden">
        <div
            v-for="period in 7"
            class="item--period"
            :id="`item--period__${period + 1}`"
        >

            <label :for="`period--input__${ period }}`">Period {{ period }}</label>
            <input type="text" class="button button__contrast" :placeholder="`Period ${period}`" :id="`period--input__${period}`" v-model.trim="periodNames[`period${period}`]" maxlength="16">
        </div>
    </div>
</div>
</template>

<style scoped style="scss">
</style>