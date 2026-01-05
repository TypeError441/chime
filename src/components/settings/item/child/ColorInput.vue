<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
    transparency: Boolean,
    alpha: {
        type: String,
        default: "1"
    }
});

const emit = defineEmits(["update:alpha"]);

const model = defineModel(); // ref

const editing = ref(false);
const editColor = () => (editing.value = true);
const closeColor = () => (editing.value = false);

// --- state ---
// Parse the model value as "r, g, b"
const parseRgb = (value) => {
    if (typeof value !== "string") return { r: 0, g: 0, b: 0 };
    const parts = value.split(",").map(c => parseInt(c.trim()));
    if (parts.length !== 3 || parts.some(isNaN)) return { r: 0, g: 0, b: 0 };
    return { r: parts[0], g: parts[1], b: parts[2] };
};

const parsed = computed(() => parseRgb(model.value));

const red = ref(parsed.value.r);
const green = ref(parsed.value.g);
const blue = ref(parsed.value.b);
const alpha = ref(props.alpha);

watch(parsed, (c) => {
    red.value = c.r;
    green.value = c.g;
    blue.value = c.b;
});

watch(() => props.alpha, (newAlpha) => {
    alpha.value = newAlpha;
});

watch(alpha, (value) => {
    emit("update:alpha", value);
});

// sync back to model, only store RGB
watch([red, green, blue], () => {
    model.value = `${red.value}, ${green.value}, ${blue.value}`;
});
</script>

<template>
<div class="color-display" :style="`--picked-color: ${model}; --red-color: ${red}; --green-color: ${green}; --blue-color: ${blue}; --alpha-color: ${alpha};`">
    <button class="swatch" @click="editColor"></button>
    <div class="pickers" v-if="editing">
        <div class="channel">
            <div class="text">{{ red }}</div>
            <div class="color-edit red">
                <div class="background"></div>
                <input type="range" min="0" max="255" v-model="red">
            </div>
        </div>
        <div class="channel">
            <div class="text">{{ green }}</div>
            <div class="color-edit green">
                <div class="background"></div>
                <input type="range" min="0" max="255" v-model="green">
            </div>
        </div>
        <div class="channel">
            <div class="text">{{ blue }}</div>
            <div class="color-edit blue">
                <div class="background"></div>
                <input type="range" min="0" max="255" v-model="blue">
            </div>
        </div>
        <div class="channel" v-if="props.transparency">
            <div class="text">{{ Math.round(alpha * 10) / 10 }}</div>
            <div class="color-edit alpha">
                <div class="background"></div>
                <input type="range" min="0" step="0.1" max="1" v-model="alpha">
            </div>
        </div>

        <button class="close" @click="closeColor">Close</button>
    </div>
</div>
</template>

<style scoped type="scss">
.color-display {
    --red-color: 0;
    --green-color: 0;
    --blue-color: 0;
    --picked-color: 0, 0, 0;

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    width: 100%;
    padding: 0.4em;
    border: 0;
    background-color: #ececec;

    .swatch {
        width: 100%;
        height: 24px;
        border: 1px solid #aaaaaa;
        background-color: rgb(var(--picked-color));
        cursor: pointer;
    }

    .pickers {
        width: 100%;
        min-height: 100%;
        background-color: white;

        .channel {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .text {
                color: black;
            }

            .color-edit {
                position: relative;
                width: 80%;
                margin: 0.25em 0;

                &.red .background { background-image: linear-gradient(to right, rgb(0, var(--green-color), var(--blue-color)), rgb(255, var(--green-color), var(--blue-color))); }
                &.green .background { background-image: linear-gradient(to right, rgb(var(--red-color), 0, var(--blue-color)), rgb(var(--red-color), 255, var(--blue-color))); }
                &.blue .background { background-image: linear-gradient(to right, rgb(var(--red-color), var(--green-color), 0), rgb(var(--red-color), var(--green-color), 255)); }
                &.alpha .background { background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgb(var(--red-color), var(--green-color), var(--blue-color), 1)); }

                .background {
                    background-image: linear-gradient(to right, black, white);
                    width: 100%;
                    height: 24px;
                }

                input[type=range] {
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    width: 100%;
                    height: 24px;
                    z-index: 2;
                    background-color: transparent;

                    &:focus {
                        outline: none;
                    }

                    &::-ms-track {
                        width: 100%;
                        cursor: pointer;

                        background-color: transparent; 
                        border-color: transparent;
                        color: transparent;
                    }

                    &::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        border: 1px solid #000000;
                        height: 100%;
                        width: 16px;
                        border-radius: 3px;
                        background-color: rgb(var(--picked-color));
                        cursor: pointer;
                    }

                    &::-moz-range-thumb {
                        border: 1px solid #000000;
                        height: 100%;
                        width: 16px;
                        border-radius: 3px;
                        background-color: rgb(var(--picked-color));
                        cursor: pointer;
                    }

                    &::-ms-thumb {
                        border: 1px solid #000000;
                        height: 100%;
                        width: 16px;
                        border-radius: 3px;
                        background-color: rgb(var(--picked-color));
                        cursor: pointer;
                    }
                }
            }
        }
        

        .close {
            width: 100%;
            height: 24px;
            border: 1px solid #aaaaaa;
            background-color: white;
            cursor: pointer;
        }
    }
}
</style>