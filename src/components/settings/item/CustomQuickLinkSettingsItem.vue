<script setup>
import { ref} from "vue";

import SettingsQuickLink from "./child/SettingsQuickLink.vue";
import ToggleSettingsItem from "../ToggleSettingsItem.vue";

import { useQuickLinks } from "../../../composables/settings";

const quickLinks = useQuickLinks();

const hidden = ref(true);
</script>

<template>
<div class="settings--item">
    <div class="item--title">
        Quick Links
    </div>
    <ToggleSettingsItem v-model="hidden" />
    <div v-if="!hidden">
        <SettingsQuickLink
            v-for="(link, index) in quickLinks"
            :id="`item--quick-link__${index}`"
            :index="index"
            :quick-link="link"
        />
        <button id="item--add-quick-link" @click="quickLinks.push({ title: 'Chime', url: 'https://chimewebsite.netlify.app/', side: 'right'})">Create</button>
    </div>
</div>
</template>

<style scoped type="scss">
#item--add-quick-link {
    display: block;
    padding: 0.75em;
    width: 80%;
    border: none;
    background-color: #71ff5e;
    color: white;
    cursor: pointer;
}
</style>