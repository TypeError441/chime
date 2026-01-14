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

    } catch (err) {
        console.error(err);
        errorMsg.value = typeof err === "string" ? err : err.message;
    }
});

function openWeather() {
    if (appearance.newtabquicklinks) {
        window.open("https://weather.com/weather/today/", "_blank");
    } else {
        window.location.href = "https://weather.com/weather/today/";
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
<button id="widget__weather" class="overlay--item" :style="`color: ${textBrightness}`" @click="openWeather">
    {{ Math.round(appearance.weatherUnit == "f" ? temp : (temp - 32) * 5 / 9) }}{{ appearance.weatherUnit == "f" ? "°F" : "°C" }}
    {{ errorMsg }}
    <img :src="`https://openweathermap.org/img/wn/${icon}@2x.png`" alt="">
</button>
</template>

<style scoped type="scss">
#widget__weather {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    grid-column: span 4;
    font-size: 2rem;

    img {
        filter: brightness(var(--image-on-bg-brightness));
        height: 100%;
        aspect-ratio: 1 / 1;
    }
}
</style>