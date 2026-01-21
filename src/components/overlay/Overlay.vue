<script setup>
import NoticeBoardDisplay from "./NoticeBoardDisplay.vue";
import FeedbackDialog from "./dialog/FeedbackDialog.vue";
import SettingsDialog from "./dialog/SettingsDialog.vue";
</script>

<template>
    <div id="overlay">
        <NoticeBoardDisplay side="left" />
        <NoticeBoardDisplay side="right" />
        <div id="overlay--dialogs">
            <FeedbackDialog />
            <SettingsDialog />
        </div>
    </div>
</template>

<style scoped type="scss">
#overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    pointer-events: none;

    #overlay--dialogs {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>