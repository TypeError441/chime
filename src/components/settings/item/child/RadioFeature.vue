<script setup>
const props = defineProps({
    display: String,
    id: String,
    values: Object
});

const model = defineModel();
</script>

<template>
<div class="item--feature button button__contrast">
    <label for="feature--title">{{ props.display }}</label>
    <div class="feature--radios">
        <div class="radio-item" v-for="(value, key) in values">
            <input type="radio" :id="key" :name="`feature--input__${id}`" :value="key" v-model="model" />
            <label :for="key">{{ value }}</label>
        </div>
    </div>
</div>
</template>

<style scoped type="scss">
.item--feature {
    justify-content: center;
    text-align: left;
    align-items: start;
    
    .feature--radios {
        display: flex;
        flex-direction: row;
    }
}
</style>