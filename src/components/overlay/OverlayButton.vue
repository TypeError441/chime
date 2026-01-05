<script setup>
import { computed } from "vue";

const props = defineProps({
    func: String
});

const title = computed(() => props.func === "feedback" ? "Feedback" : "Sidebar");
</script>

<template>
<button class="widget__overlay-button overlay--item" @click="$emit(props.func)">
    <img :src="`/images/${props.func}.png`">
    <p class="overlay-button--tooltip">{{ title }}</p>
</button>
</template>

<style scoped type="scss">
.widget__overlay-button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    &:hover {
        background-color: rgb(var(--radial-background-color));
        cursor: pointer;

        .overlay-button--tooltip {
            visibility: visible;
            background-color: rgb(var(--radial-background-color));
            opacity: 1;
        }
    }

    img {
        width: 32px;
        filter: brightness(var(--image-on-bg-brightness));
    }

    .overlay-button--tooltip {
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
        overflow: hidden;
        opacity: 0;

        transition: opacity 0.1s linear;
    }
}

</style>