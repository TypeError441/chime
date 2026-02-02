<script setup>
import { onMounted, onUnmounted, watch, ref } from "vue";

import { useApplySettings } from "../../composables/apply";

const { getTheme } = useApplySettings();

const theme = getTheme();

let canvas;
let ctx;

const offset = ref(0);
const stops = ref([]);
let rafId = null;
let lastTime = performance.now();

function createStops() {
    stops.value = [];

    theme.background.colors.forEach((color, index) => {
        const pos = (index / Math.max(theme.background.colors.length, 1)) / 2
        stops.value.push({ color: color, pos: pos });
    });

    theme.background.colors.forEach((color, index) => {
        const pos = ((index / Math.max(theme.background.colors.length, 1)) / 2) + 0.5
        stops.value.push({ color: color, pos: pos });
    });
}

function draw() {
    // Resize
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    // Background
    let grad;

    if (theme.background.type == "linear") {
        grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    } else {
        grad = ctx.createRadialGradient(window.innerWidth / 2, window.innerHeight / 2, 0, window.innerWidth / 2, window.innerHeight / 2, Math.max(window.innerWidth, window.innerHeight) * 1.25);
    }

    let closestStopToEnd = stops.value[0];

    stops.value.forEach(stop => {
        const pos = stop.pos;
        if (pos <= 1 && pos > 0 && closestStopToEnd?.pos <= stop.pos) {
            closestStopToEnd = stop;
        }
    });

    grad.addColorStop(0, `rgb(${closestStopToEnd.color})`);
    stops.value.forEach(stop => {
        const pos = stop.pos;
        if (pos <= 1 && pos > 0) {
            grad.addColorStop(pos, `rgb(${stop.color})`);
        }
    });

    ctx.fillStyle = grad;
    ctx.save();
    ctx.translate(0, 0);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function animate(time) {
    if (theme.background.speed > 0) {
        const delta = time - lastTime;
        lastTime = time;

        for (let i = 0; i < stops.value.length; i++) {
            stops.value[i].pos += (theme.background.speed / 100) * (delta / 16.67);
            if (stops.value[i].pos > 1) {
                stops.value[i].pos -= 1;
            }
        }
    }

    draw();
    rafId = requestAnimationFrame(animate);
}

onMounted(() => {
    canvas = document.querySelector("#background--gradient");
    ctx = canvas.getContext("2d");

    createStops();
    draw();
    rafId = requestAnimationFrame(animate);
    window.addEventListener("resize", () => {
        draw();
    });
    console.log(theme);
});

onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId);
});

watch(theme, () => {
    createStops();
    draw();
});
</script>

<template>
    <canvas id="background--gradient">
    </canvas>
</template>

<style scoped type="scss">
#background--gradient {
    width: 100%;
    height: 100%;
}
</style>