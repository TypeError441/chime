<script setup>
import { useCurrentDialog } from "../../composables/settings";

const currentDialog = useCurrentDialog();

function exit() {
    currentDialog.value = "none";
}
</script>

<template>
<button type="button" class="close" @click="exit"><img src="/images/close.png" alt=""></button>
</template>

<style scoped type="scss">

.close {
    position: absolute;
    right: 1em;
    top: 1em;
    background: none;
    border: none;
    width: 3em;
    height: 3em;
    aspect-ratio: 1 / 1;

    img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: contain;
        filter: brightness(var(--image-on-bg-brightness));
        transition: width 0.2s ease-in-out;

        &:hover {
            width: 90%;
            cursor: pointer;
        }
    }
}
</style>