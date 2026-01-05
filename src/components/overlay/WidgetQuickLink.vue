
<script setup>
import { useAppearance } from '../../composables/settings';

const appearance = useAppearance();

const props = defineProps({
    title: String,
    url: String
});
</script>

<template>
<a class="widget__quick-link overlay--item" :href="url.startsWith('https://') ? url : 'https://' + url" :target="appearance.newtabquicklinks ? '_blank' : ''">
    <img :src="'https://www.google.com/s2/favicons?domain=' + url + '&sz=128'" alt="">
    <p class="quick-link--tooltip">{{ title }}</p>
</a>
</template>

<style scoped type="scss">
.widget__quick-link {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    &:hover {
        background-color: rgb(var(--radial-background-color));
        cursor: pointer;

        .quick-link--tooltip {
            visibility: visible;
            background-color: rgb(var(--radial-background-color));
            opacity: 1;
        }
    }

    img {
        width: 32px;
    }

    .quick-link--tooltip {
        visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -90%);
        width: 100%;
        height: 50%;
        background-color: rgb(var(--sidebar-background-color));
        color: rgb(var(--color));
        font-weight: bold;
        font-size: 1rem;
        white-space: nowrap;
        opacity: 0;

        transition: opacity 0.1s linear;
    }
}

</style>