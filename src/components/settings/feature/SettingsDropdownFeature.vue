<script setup>
const props = defineProps([
    "optionIDs",
    "options",
    "name"
]);

const model = defineModel();

</script>

<template>
    <select class="button button__contrast glass" v-model="model">
        <option
            v-for="optionID in props.optionIDs"
            :id="optionID"
            :value="optionID"
            :hidden="props.options[optionID].meta.special"
        >
        {{ props.name == "none" ? optionID : props.options[optionID].meta.name }}
        </option>
    </select>
</template>

<style scoped type="scss">
</style>