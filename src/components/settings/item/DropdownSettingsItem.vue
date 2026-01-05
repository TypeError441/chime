<script setup>
const props = defineProps([
    "name",
    "optionIDs",
    "options",
    "hidden"
]);

const model = defineModel();

function isHidden(optionID) {
    if (!props.hidden) return false;

    return props.options?.[optionID]?.[props.hidden] === "true";
}
</script>

<template>
<div class="settings--item">
    <div class="item--title">
        {{ props.name }}
    </div>
    <select class="button button__contrast" v-model="model">
        <option
            v-for="optionID in props.optionIDs"
            :id="optionID"
            :value="optionID"
            :hidden="isHidden(optionID)"
        >
        {{ options[optionID].name }}
        </option>
    </select>
</div>
</template>

<style scoped type="scss">
</style>