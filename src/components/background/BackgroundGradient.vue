<script setup>
import { ref, computed, watch } from "vue";

import { useApplySettings } from "../../composables/apply";

const { getTheme } = useApplySettings();

const theme = getTheme();

const gradientString = computed(() => {
    if (theme.background.type == "transition") return "none";
    let colors = "";
    theme.background.colors.forEach((color, index) => {
        colors += `rgb(${color})${index < theme.background.colors.length - 1 ? ", " : ""}`;
    });

    return `linear-gradient(${colors})`;
});

const currentBgColor = ref(0);

let intervalID = null;

function changeColor() {
    currentBgColor.value++;
    if (currentBgColor.value >= theme.background.colors.length) currentBgColor.value = 0;
}

watch(theme, () => {
    if (theme.background.type == "linear") return;
    clearInterval(intervalID);
    
    changeColor();
    intervalID = setInterval(changeColor, 1000 / theme.background.speed );
}, { immediate: true });
</script>

<template>
    <div id="background--gradient"
        :style="{
            backgroundColor: `rgb(${theme.background.colors[currentBgColor]})`,
            backgroundImage: gradientString,
            transition: theme.background.type == 'transition' ? 'background-color calc(1s / var(--background-speed)) linear' : 'none'
        }"
    ></div>
</template>

<style scoped type="scss">
#background--gradient {
    width: 100%;
    height: 100%;
}
</style>