<script setup>
import { ref, watch, onMounted } from 'vue';

import { usePeriods, useSchool } from "../../../composables/settings";

const periodNames = usePeriods();

const school = useSchool();

const periods = ref(0);

onMounted(async () => {
    const module = await import(`../../../assets/calendars/${school.value}.json`);
    periods.value = module.default.periods;
});

</script>

<template>
<div id="settings--classes" class="settings--category-content">
    <div class="settings--item">
        <div class="item--title">Period Names</div>
        <div
            v-for="period in periods"
            class="item--period"
            :id="`item--period__${period + 1}`"
        >

            <div class="item--subtitle">Period {{ period }}</div>
            <input type="text" class="button glass period--input" :placeholder="`Period ${period}`" v-model.trim="periodNames[`period${period}`]" maxlength="16">
        </div>
    </div>
    <!-- school -->
</div>
</template>

<style scoped type="scss">
    .period--input {
        --glass-color: var(--color);
        margin: 0 0 1rem 0;
        color: white;
    }
</style>