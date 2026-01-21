<script setup>
import { toRaw } from "vue";

const props = defineProps([
    "optionIDs",
    "options",
    "name"
]);

const rawOptions = toRaw(props.options);

const model = defineModel();

</script>

<template>
    <select class="button button__contrast glass" v-model="model">
        <option
            v-for="optionID in props.optionIDs"
            :id="optionID"
            :value="optionID"
            :hidden="props.options[optionID].special"
        >
        {{ props.name == "none" ? optionID : props.options[optionID].name }}
        </option>
    </select>
</template>

<style scoped type="scss">
</style>