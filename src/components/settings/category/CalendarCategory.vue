<script setup>
import SettingsRangeFeature from "../feature/SettingsRangeFeature.vue";

import { useStats } from "../../../composables/settings";

const stats = useStats();
</script>

<template>
<div id="settings--calendar" class="settings--category-content">
    <div class="settings--item">
        <div class="item--title">Tune</div>
        <SettingsRangeFeature
            v-model="stats.tune"
            :min="-90"
            :max="90"
            :step="1"
            label="raw"
        />
    </div>
    <!-- which schedules on which days
    schedule override list -->
</div>
</template>