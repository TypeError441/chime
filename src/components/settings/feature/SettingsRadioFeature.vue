<script setup>
const props = defineProps({
    id: String,
    values: Object
});

const model = defineModel();
</script>

<template>
<div class="item--feature feature__radio">
    <button
        v-for="(value, key) in props.values"
        class="feature--radio button glass"
        :class="{selected: model == key}"
        :key="key"
        @click="model = key"
    >
        <label :for="`${props.id}-${key}`">{{ value }}</label>
    </button>
</div>
</template>

<style scoped type="scss">
.feature__radio {
    .feature--radio {
        --glass-color: var(--sidebar-background-color);
        display: flex;
        flex-direction: row;
        font-size: 1rem;
        color: rgb(var(--color));
        margin: 0.25em 0;
        min-width: 50%;
        width: fit-content;

        &.selected {
            --glass-color: var(--radial-background-color);
            font-weight: bold;
        }
    }
}
</style>