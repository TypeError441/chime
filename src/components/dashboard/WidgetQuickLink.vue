
<script setup>
import { useAppearance } from '../../composables/settings';

const appearance = useAppearance();

const props = defineProps({
    title: String,
    url: String
});
</script>

<template>
<a class="pinned--quick-link pinned--button glass glass_child" :href="url.startsWith('https://') ? url : 'https://' + url" :target="appearance.newtabquicklinks ? '_blank' : ''">
    <img :src="'https://www.google.com/s2/favicons?domain=' + url + '&sz=128'" alt="">
    <p class="button--tooltip">{{ title }}</p>
</a>
</template>