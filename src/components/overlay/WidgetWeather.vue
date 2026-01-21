<script setup>
import { ref, onMounted, computed } from "vue";

import { useAppearance, useCustomtheme } from "../../composables/settings";

import themes from "../../assets/themes.json";

const appearance = useAppearance();
const customtheme = useCustomtheme();

const data = ref(null);
const temp = ref(null);
const icon = ref(null);
const errorMsg = ref("");

onMounted(async () => {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=37.3814&lon=-122.1143&exclude=minutely,hourly,daily&units=imperial&appid=668b2ad8a862a7a1ed60c08264b6620b`
        );

        if (!res.ok) throw new Error("Network error");

        data.value = await res.json();


        temp.value = data.value.current.temp;

        icon.value = data.value.current.weather[0].icon;

        icon.value = icon.value.substring(0, 2);

    } catch (err) {
        console.error(err);
        errorMsg.value = typeof err === "string" ? err : err.message;
    }
});

function openWeather() {
    if (appearance.newtabquicklinks) {
        window.open("https://weather.com/weather/today/l/61fb84737ec46bae66bc22152751259aa6a42553037a5fc9796b1be0c14fe53c", "_blank");
    } else {
        window.location.href = "https://weather.com/weather/today/l/61fb84737ec46bae66bc22152751259aa6a42553037a5fc9796b1be0c14fe53c";
    }
}

const textBrightness = computed(() => {
    const theme = appearance.theme === "custom" ? customtheme : themes[appearance.theme];
    const value = Math.max(
        0,
        Math.min(15, Math.floor(Number(theme.imageOnBgBrightness) * 16))
    );

    const hex = value.toString(16);
    return `#${hex.repeat(6)}`;
});
</script>

<template>
<button id="widget__weather" class="notice-board-display--item glass" :style="`color: ${textBrightness}`" @click="openWeather">
    <img :src="`/images/weather/${icon}d.png`" alt="">
    {{ Math.round(appearance.weatherUnit == "f" ? temp : (temp - 32) * 5 / 9) }}{{ appearance.weatherUnit == "f" ? "°F" : "°C" }}
    {{ errorMsg }}
</button>
</template>

<style scoped type="scss">
#widget__weather {
    display: flex;
    align-items: center;
    flex-direction: row;
    font-size: 2rem;
    grid-column: span 2;
    grid-row: span 2;
    cursor: pointer;

    img {
        filter: brightness(var(--image-on-bg-brightness));
        height: 75%;
        aspect-ratio: 1 / 1;
        margin-right: 0.5em;
    }
}
</style>