<script setup>
import { useSidebarOpened } from "../../composables/settings";

import SidebarCalendar from "./SidebarCalendar.vue";
import SidebarSelectSchedule from "./SidebarSelectSchedule.vue";

const sidebarOpened = useSidebarOpened();
</script>

<template>
<div id="sidebar" :class="{'sidebar__opened': sidebarOpened}">
    <h1 id="sidebar--title">Schedule</h1>
    <SidebarCalendar />
    <SidebarSelectSchedule />
</div>
</template>

<style scoped type="scss">
#sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 0;
    right: calc(-1 * min(30vw, 350px));
    width: min(30vw, 350px);
    height: 100vh;
    background-color: rgb(var(--sidebar-background-color));
    border-radius: 1rem 0 0 1rem;

    transition: right 0.4s cubic-bezier(0.76, 0, 0.24, 1);

    &.sidebar__opened {
        right: 0;
    }

    #sidebar--title {
        margin: 0;
        padding: 1rem 1.5rem;
        width: 100%;
    }
}
</style>