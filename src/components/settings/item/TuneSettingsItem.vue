<script setup>
import { useStats } from "../../../composables/settings";

const stats = useStats();
</script>

<template>
<div class="settings--item">
    <div class="item--title">
        Tune
    </div>
    <label for="item--input__tune">Recommended - Dec 19: 0</label>
    <input type="number" id="item--input__tune" class="button button__contrast" v-model.number="stats.tune" @change="stats.tune = Math.min(Math.max(stats.tune, -90), 90)" min="-90" max="90" />
</div>
</template>