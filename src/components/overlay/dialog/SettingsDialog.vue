<script setup>
import { ref, watch, onMounted } from "vue";
import pkg from "../../../../package.json";

import CloseDialog from "../CloseDialog.vue";
import AppearanceCategory from "../../settings/category/AppearanceCategory.vue";
import CustomThemeCategory from "../../settings/category/CustomThemeCategory.vue";
import CalendarCategory from "../../settings/category/CalendarCategory.vue";
import ClassesCategory from "../../settings/category/ClassesCategory.vue";
import PinnedCategory from "../../settings/category/PinnedCategory.vue";
import ClearSettingsButton from "../../settings/ClearSettingsButton.vue";
import ResetNotificationsButton from "../../settings/ResetNotificationsButton.vue";

import { useAppearance, useCurrentDialog } from "../../../composables/settings";

const currentDialog = useCurrentDialog();
const appearance = useAppearance();

const version = pkg.version;

const selectedCategory = ref("appearance");
</script>

<template>
<dialog id="overlay--dialog__settings" class="overlay--dialog glass" :class="{open: currentDialog == 'settings'}"  :open="currentDialog == 'settings'">
    <CloseDialog />
    <div id="dialog__settings--categories" class="glass">
        <p id="settings--title">Settings</p>
        <div id="categories--options">
            <div :class="{selected: selectedCategory == 'appearance'}" class="glass glass__child categories--option" @click="selectedCategory = 'appearance'">Appearance</div>
            <div :class="{selected: selectedCategory == 'customtheme'}" class="glass glass__child categories--option category__tabbed" v-if="appearance.theme == 'custom'" @click="selectedCategory = 'customtheme'">Custom Theme</div>
            <div :class="{selected: selectedCategory == 'calendar'}" class="glass glass__child categories--option" @click="selectedCategory = 'calendar'">Calendar</div>
            <div :class="{selected: selectedCategory == 'classes'}" class="glass glass__child categories--option" @click="selectedCategory = 'classes'">Classes</div>
            <div :class="{selected: selectedCategory == 'pinned'}" class="glass glass__child categories--option" @click="selectedCategory = 'pinned'">Pinned</div>
        </div>
        <ClearSettingsButton />
        <ResetNotificationsButton />
    <p id="version">v{{ version }}</p>
    </div>
    <AppearanceCategory v-if="selectedCategory == 'appearance'" />
    <CustomThemeCategory v-if="selectedCategory == 'customtheme'" />
    <CalendarCategory v-if="selectedCategory == 'calendar'" />
    <ClassesCategory v-if="selectedCategory == 'classes'" />
    <PinnedCategory v-if="selectedCategory == 'pinned'" />
</dialog>
</template>

<style scoped type="scss">
#overlay--dialog__settings.open {
    display: flex;
    flex-direction: row;
    color: rgb(var(--color));

    #dialog__settings--categories {
        --glass-color: var(--sidebar-background-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 2em 0 0 2em;
        width: fit-content;
        min-width: 20%;
        padding: 1em;

        #settings--title {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0 0 1em 0;
        }

        #categories--options {
            flex: 1;
            overflow-y: auto;
        }

        #version {
            margin: 0.5em 0;
        }
    }
}
</style>