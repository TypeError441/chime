<script setup>
import { onBeforeMount } from "vue";

import { useLoadLocalStorageSettings, useDisableTransitions, useDetectSaveSettings } from "./composables/load";
import { tick } from "./composables/tick";
import { useApplySettings } from "./composables/apply";

import Dashboard from "./components/dashboard/Dashboard.vue";
import Overlay from "./components/overlay/Overlay.vue";
import Background from "./components/background/Background.vue";


onBeforeMount(async () => {
    const { loadLocalStorageSettings } = useLoadLocalStorageSettings();
    await loadLocalStorageSettings();

    const { disableTransitions } = useDisableTransitions();
    disableTransitions();

    const { detectSaveSettings } = useDetectSaveSettings();
    await detectSaveSettings();
});

const { applyTheme, applyFont } = useApplySettings();

applyTheme();
applyFont();

tick();
</script>

<template>
    <Overlay />
    <Dashboard />
    <Background />
</template>

<style scoped type="scss">
#workspace {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: fit-content;
    overflow: none;
    
    transition: width 0.4s cubic-bezier(0.76, 0, 0.24, 1);

    &.workspace__sidebar-opened {
        width: calc(100vw - min(30vw, 350px));
    }
}
</style>