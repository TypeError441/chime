<script setup>
import { ref } from "vue";

import ClearSettingsButton from "../settings/ClearSettingsButton.vue";
import ResetNotificationsButton from "../settings/ResetNotificationsButton.vue";

import pkg from "../../../package.json";

const version = ref(pkg.version);
</script>

<template>
<div id="settings--corner">
    <ResetNotificationsButton />
    <ClearSettingsButton />
    <p class="version">Version {{ version }}</p>
</div>
</template>

<style scoped type="scss">
#settings-corner {
    position: sticky;
    top: calc((100vh - 7em) * -1);
    left: 0;
    margin: 0.5em;
    display: flex;
    flex-direction: column;

    button {
        margin: 0.25em 0;
    }

    .version {
        margin: 0em;
    }
}
</style>