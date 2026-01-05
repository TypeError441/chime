<script setup>
const props = defineProps({
    display: String
});

const model = defineModel();
</script>

<template>
<div class="item--feature button button__contrast">
    <label :for="`feature--input__${props.display}`">{{ props.display }}</label>
    <input type="checkbox" name="feature--input" :id="`feature--input__${props.display}`" v-model="model">
</div>
</template>

<style scoped type="scss">
.item--feature {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 3em;
}
</style>