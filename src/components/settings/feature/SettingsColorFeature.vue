<script setup>
import { ref, watch } from 'vue';

import SettingsRangeFeature from './SettingsRangeFeature.vue';

const props = defineProps({
    color: { type: String, default: '255, 255, 255' },
    transparency: Number
});

const emit = defineEmits(['update:color', 'update:transparency']);

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
const internalTransparency = ref(props.transparency ?? 0);

watch(() => props.color, (newColor) => {
    internalColor.value = rgbToHex(newColor);
});

watch(() => props.transparency, (newVal) => {
    if (newVal !== undefined) internalTransparency.value = newVal;
});

watch(internalColor, (newHex) => {
    emit('update:color', hexToRgb(newHex));
});

watch(internalTransparency, (newVal) => {
    emit('update:transparency', newVal);
});
</script>

<template>
<div class="item--feature feature__color">
    <input type="color" class="feature--input glass" v-model="internalColor">

    <div class="item--subtitle" v-if="props.transparency !== undefined">Transparency</div>
    <SettingsRangeFeature
        v-if="props.transparency !== undefined"
        :min="0"
        :max="1"
        :step="0.01"
        v-model="internalTransparency"
        label="percent"
    />
</div>
</template>

<style scoped type="scss">
.feature__color {
    .feature--input {
        --glass-color: var(--color);
        position: relative;
        width: 100%;
        height: calc(2rem + 2px);

        .display--handle {
            --glass-color: 255, 255, 255;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgba(255, 255, 255, 0.7);
            width: 2rem;
            height: 2rem;
            padding: 0;
            border-radius: 50%;
            transition: left 0.2s ease-in-out;

            &.on {
                left: calc(100% - 2rem);
            }
        }
    }

    p {
        margin: 0 0 0 1rem;
    }
}
</style>