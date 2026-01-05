<script setup>
import { onBeforeMount } from "vue";

import { useSidebarOpened } from "./composables/settings";
import { useCookies } from "./composables/cookie";
import { useLoadLocalStorageSettings, useDisableTransitions, useDetectSaveSettings } from "./composables/load";
import { tick } from "./composables/tick";
import { useApplySettings } from "./composables/apply";

import Dashboard from "./components/dashboard/Dashboard.vue";
import Overlay from "./components/overlay/Overlay.vue";
import Settings from "./components/settings/Settings.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";

const sidebarOpened = useSidebarOpened();

onBeforeMount(async () => {
    const { loadLocalStorageSettings } = useLoadLocalStorageSettings();
    await loadLocalStorageSettings();

    const { disableTransitions } = useDisableTransitions();
    disableTransitions();

    const { detectSaveSettings } = useDetectSaveSettings();
    await detectSaveSettings();
});

const { applyTheme, applyFont } = useApplySettings();
const { getCookie, setCookie } = useCookies();

applyTheme();
applyFont();

tick();
</script>

<template>
    <div id="workspace" :class="{'workspace__sidebar-opened': sidebarOpened}">
        <Overlay />
        <Dashboard />
        <Settings />
        <div>{{  getCookie("id") }}</div>
        
    </div>
    <Sidebar />
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