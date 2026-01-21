<script setup>
const props = defineProps({
    func: String
});
</script>

<template>
<button class="pinned--button glass glass_child">
    <img :src="`/images/${props.func.toLowerCase()}.png`">
    <p class="button--tooltip">{{ props.func }}</p>
</button>
</template>

<style scoped type="scss">
img {
    filter: brightness(var(--image-on-bg-brightness));
}
</style>