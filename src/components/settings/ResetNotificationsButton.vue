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
<div id="settings--reset-notifications" class="glass glass__child categories--option" @click="resetNotifications">Show All Notifications</div>
</template>

<style scoped type="scss">
#settings--reset-notifications {
    padding: 0.5em;
    border: none;
    cursor: pointer;
}
</style>