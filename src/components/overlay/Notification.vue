<script setup>
import { useNotifications } from "../../composables/settings";

const notifications = useNotifications();

const props = defineProps({
    content: String,
    id: String
});

function disable() {
    notifications[props.id] = true;
}
</script>

<template>
<div :id="props.id" class="widget__notification overlay--item" v-if="!notifications[props.id]">
    <button class="notification--close button__danger" @click="disable">X</button>
    <p class="notification--content">{{ content }}</p>
</div>
</template>

<style scoped type="scss">
.widget__notification {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    grid-column: span 6;

    .notification--content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        font-size: 0.8rem;
        text-align: left;
        margin-left: 1rem;
    }

    .notification--close {
        position: absolute;
        left: 0.5rem;
        top: 0.5rem;
        border: none;
        border-radius: 100000%;

        &:hover {
            cursor: pointer;
        }
    }
}
</style>