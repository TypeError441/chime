<script setup>
import { ref } from "vue";
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

const categoriesToggled = ref(true);

function selectCategory(category) {
    categoriesToggled.value = false;
    selectedCategory.value = category;
}
</script>

<template>
<dialog id="overlay--dialog__settings" class="overlay--dialog glass" :class="{open: currentDialog == 'settings'}"  :open="currentDialog == 'settings'">
    <CloseDialog />
    <p id="settings--title" :class="{toggled: categoriesToggled}">Settings</p>
    <div id="dialog__settings--categories" class="glass" :class="{toggled: categoriesToggled}">
        <button type="button" class="close" :class="{toggled: categoriesToggled}" @click="() => categoriesToggled = !categoriesToggled"><img src="/images/collapse.png" alt=""></button>
        <div id="categories--options">
            <div class="gap"></div>
            <div :class="{selected: selectedCategory == 'appearance'}" class="glass glass__child categories--option" @click="selectCategory('appearance')">Appearance</div>
            <div :class="{selected: selectedCategory == 'customtheme'}" class="glass glass__child categories--option category__tabbed" v-if="appearance.theme == 'custom'" @click="selectCategory('customtheme')">Custom Theme</div>
            <div :class="{selected: selectedCategory == 'calendar'}" class="glass glass__child categories--option" @click="selectCategory('calendar')">Calendar</div>
            <div :class="{selected: selectedCategory == 'classes'}" class="glass glass__child categories--option" @click="selectCategory('classes')">Classes</div>
            <div :class="{selected: selectedCategory == 'pinned'}" class="glass glass__child categories--option" @click="selectCategory('pinned')">Pinned</div>
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

    #settings--title {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 3;
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0 0 1em 0;
    }

    #dialog__settings--categories {
        --glass-color: var(--accent-color);
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 2em 0 0 2em;
        width: fit-content;
        min-width: 20%;
        padding: 1em;

        .gap {
            height: 2.5em;
        }

        .close {
            display: none;
        }

        #categories--options {
            flex: 1;
            overflow-y: auto;
        }

        #version {
            margin: 0.5em 0;
        }
    }

    @media (max-width: 650px) {
        #settings--title {
            position: absolute;
            left: 5rem;
            z-index: 3;
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0 0 1em 0;
            transition: left 0.2s ease-in-out;

            &.toggled {
                left: 1rem;
            }
        }
        
        #dialog__settings--categories {
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 2;
            border-radius: 0;
            left: calc(-100% + 4rem);
            transition: left 0.2s ease-in-out;

            &.toggled {
                left: 0;
            }

            .close {
                display: block;
                transition: transform 0.2s ease-in-out;

                &.toggled {
                    transform: rotateZ(180deg);
                }
            }
        }
    }
}
</style>