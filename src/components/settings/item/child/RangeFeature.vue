<script setup>
const props = defineProps({
    display: String,
    min: Number,
    max: Number
});

const model = defineModel();
</script>

<template>
<div class="item--feature button button__contrast">
    <label :for="`feature--input__${props.display}`">{{ props.display }}</label>
    <input type="range" :name="`feature--input__${props.display}`" :id="`feature--input__${props.display}`" v-model="model" :min="min" :max="max">
</div>
</template>

<style scoped type="scss">
.item--feature {
    justify-content: center;
    text-align: left;
    align-items: start;

    input {
        width: min(160px, 80%);
    }
}
</style>