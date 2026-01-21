<script setup>
import { ref } from "vue";

const props = defineProps({
    label: String,
    min: Number,
    max: Number,
    step: Number
});

const model = defineModel();

const percent = ref((model.value - props.min) / (props.max - props.min));

const trackRef = ref(null);
const dragging = ref(false);

function snapToStep(value) {
    const step = props.step || 1;
    return Math.round(value / step) * step;
}

function onMouseDown(e) {
    dragging.value = true;
    updateFromMouse(e);

    window.addEventListener("mousemove", updateFromMouse);
    window.addEventListener("mouseup", stopDragging);
}

function stopDragging() {
    dragging.value = false;
    window.removeEventListener("mousemove", updateFromMouse);
    window.removeEventListener("mouseup", stopDragging);
}

function updateFromMouse(e) {
    const rect = trackRef.value.getBoundingClientRect();

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const handleWidth = 2 * rem;

    const trackLeft = rect.left + rem;
    const trackWidth = rect.width - handleWidth;

    let mouseX = e.clientX - trackLeft;

    // Clamp mouseX to [0, trackWidth]
    mouseX = Math.max(0, Math.min(trackWidth, mouseX));

    let rawValue = props.min + (mouseX / trackWidth) * (props.max - props.min);
    let snappedValue = snapToStep(rawValue);

    // Clamp snappedValue to [min, max]
    snappedValue = Math.max(props.min, Math.min(props.max, snappedValue));

    model.value = snappedValue;
    percent.value = (snappedValue - props.min) / (props.max - props.min);
}
</script>

<template>
<div class="item--feature feature__range">
    <div class="feature--slider button glass" :class="{label: props.label}" ref="trackRef" @mousedown="onMouseDown">
        <div class="display--handle" :style="{ left: 'calc(' + (percent * 100) + '% - ' + (percent*2) + 'rem)' }"></div>
    </div>
    <p v-if="props.label">
        {{ props.label == "percent" ? Math.round(percent * 100) : model }}
        {{ props.label == "percent" ? "%" : "" }}
    </p>
</div>
</template>

<style scoped type="scss">
.feature__range {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: fit-content;

    .feature--slider {
        --glass-color: var(--color);
        position: relative;
        height: calc(2rem + 2px);
        width: 100%;

        &.label {
            width: 75%;
        }

        .display--handle {
            --glass-color: 255, 255, 255;
            position: absolute;
            left: calc(100% - 2rem);
            top: 0;
            background-color: rgba(255, 255, 255, 0.7);
            width: 2rem;
            height: 2rem;
            padding: 0;
            border-radius: 50%;
        }
    }

    p {
        margin: 0;
    }
}
</style>