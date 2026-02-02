<script setup>
import { computed } from "vue";

import { useStats, useAppearance } from "../../composables/settings";
import { useApplySettings } from "../../composables/apply";

const stats = useStats();
const appearance = useAppearance();

const { getTheme } = useApplySettings();

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

const theme = getTheme();

const fill = computed(() => {
    if (!theme) {
        return "rgba(255, 255, 255, 0)";
    }

    let secondaryAccentColor =
        theme.meta?.version === undefined
            ? theme.radialBackgroundColor
            : (theme.meta?.version >= 2
                ? theme.colors.secondaryAccentColor
                : "255, 255, 255");

    return `rgba(${secondaryAccentColor}, ${theme.radialTransparency})`;
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