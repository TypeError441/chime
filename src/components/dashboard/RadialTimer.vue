<script setup>
import { computed } from "vue";

import { useStats, useAppearance, useCustomtheme } from "../../composables/settings";

import themes from "../../assets/themes.json";

const stats = useStats();
const appearance = useAppearance();
const customtheme = useCustomtheme();

let cx = 100, cy = 100, r = 100;
const d = computed(() => {
if (stats.percent < 1) { // 1 arc
    let angle = stats.percent * 360;
    let radians = (270 - angle) * (Math.PI / 180);
    let x = cx + r * Math.cos(radians);
    let y = cy + r * Math.sin(radians);
    let largeArcFlag = angle > 180 ? 1 : 0;
    return `
        M${cx},${cy}
        L${cx},${cy - r}
        A${r},${r} 0 ${largeArcFlag},0 ${x},${y}
        Z
    `;
}
else {
    return `
        M${cx},${cy}
        L${cx},${cy - r}
        A${r},${r} 0 1,1 ${cx},${cy + r}
        A${r},${r} 0 1,1 ${cx},${cy - r}
        Z
    `;
}
});

const fill = computed(() => {
    return `
        rgba(
            ${appearance.theme == "custom"
            ? customtheme.radialBackgroundColor
            : themes[appearance.theme].radialBackgroundColor},
            
            ${appearance.theme == "custom"
            ? customtheme.radialTransparency
            : themes[appearance.theme].radialTransparency}
        )
    `;
});
</script>

<template>
<svg id="radial-timer" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" :style="`width: ${appearance.piesize}%; max-width: ${appearance.piesize}vh`">
    <path
        :d="d"
        :fill="fill"
    />
</svg>
</template>

<style scoped type="scss">
#radial-timer {
    aspect-ratio: 1 / 1;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>