<script setup>
import { useNotifications } from "../../composables/settings";

const notifications = useNotifications();

function resetNotifications() {
    Object.keys(notifications).forEach(notification => {
        notifications[notification] = false;
    });
}
</script>

<template>
<button id="settings--reset-notifications" class="button__contrast" @click="resetNotifications">Show all notifications</button>
</template>

<style scoped type="scss">
#settings--reset-notifications {
    padding: 0.5em;
    border: none;
    cursor: pointer;
}
</style>