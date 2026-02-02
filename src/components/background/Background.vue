<script setup>
import BackgroundGradient from "./BackgroundGradient.vue";
import BackgroundImages from "./BackgroundImages.vue";
</script>

<template>
    <div id="background">
        <BackgroundImages />
        <BackgroundGradient />
    </div>
</template>

<style scoped type="scss">
#background {
    position: absolute;

    z-index: -1;
    width: 100vw;
    height: 100vh;
}
</style>