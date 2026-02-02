<script setup>
import { ref } from "vue";

import { useCustomtheme } from "../../../composables/settings";

import SettingsColorFeature from "./SettingsColorFeature.vue";
import SettingsRadioFeature from "./SettingsRadioFeature.vue";
import SettingsRangeFeature from "./SettingsRangeFeature.vue";

const customtheme = useCustomtheme();

</script>

<template>
<div id="item--background-colors">
    <div class="item--subtitle">Colors</div>
    <button id="item--add-background-color" class="button button__success glass" @click="customtheme.background.colors.push('255, 255, 255')">+ Add</button>
    <SettingsColorFeature
        v-for="index in customtheme.background.colors.length"
        v-model:color="customtheme.background.colors[index - 1]"
        :remove="customtheme.background.colors.length > 1"
        :index="index - 1"
    />
    <div class="item--subtitle" v-if="customtheme.background.colors.length > 1">Type</div>
    <SettingsRadioFeature
        v-if="customtheme.background.colors.length > 1"
        id="background-type"
        v-model="customtheme.background.type"
        :values="{linear: 'Gradient', transition: 'Transition'}"
    />
    <div class="item--subtitle" v-if="customtheme.background.colors.length > 1 && customtheme.background.type == 'transition'">Speed</div>
    <SettingsRangeFeature
        :min="0.1"
        :max="1"
        :step="0.01"
        v-model="customtheme.background.speed"
        v-if="customtheme.background.colors.length > 1 && customtheme.background.type == 'transition'"
        label
    />
</div>
</template>

<style scoped type="scss">
#item--add-background-color {
    color: white;
    width: fit-content;
    padding: 0 2rem;
    height: 3rem;
}
</style>