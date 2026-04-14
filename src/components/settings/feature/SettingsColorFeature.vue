<script setup>
import { ref, watch } from 'vue';

import { useCustomtheme } from '../../../composables/settings';

const props = defineProps({
    color: { type: String, default: '255, 255, 255' },
    remove: Boolean,
    index: Number
});

const customtheme = useCustomtheme();

const emit = defineEmits(['update:color']);

function rgbToHex(rgb) {
    return '#' + rgb.split(',').map(c => {
        const num = parseInt(c.trim());
        return num.toString(16).padStart(2, '0');
    }).join('');
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

const internalColor = ref(rgbToHex(props.color));

watch(() => props.color, (newColor) => {
    internalColor.value = rgbToHex(newColor);
});

watch(internalColor, (newHex) => {
    emit('update:color', hexToRgb(newHex));
});
</script>

<template>
<div class="item--feature feature__color glass">
    <div>
        <input type="color" class="feature--input" :class="{remove: props.remove}" v-model="internalColor">
    </div>
    <button v-if="props.remove" class="remove-background-color button button__danger glass" @click="customtheme.background.colors.splice(props.index, 1)">×</button>
</div>
</template>

<style scoped type="scss">
.feature__color {
    --glass-color: var(--color);
    position: relative;
    width: 100%;
    padding: 1em;
    margin: 1em 0;
    
    .feature--input {
        width: 100%;
        min-height: 100%;

        &.remove {
            width: 85%;
        }
    }

    p {
        margin: 0 0 0 1rem;
    }

    .remove-background-color {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 1em;
        color: white;
        width: fit-content;
        width: 3rem;
        height: 3rem;
    }
}
</style>