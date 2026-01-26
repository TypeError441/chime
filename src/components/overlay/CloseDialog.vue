<script setup>
import { useCurrentDialog } from "../../composables/settings";

const currentDialog = useCurrentDialog();

function exit() {
    currentDialog.value = "none";
}
</script>

<template>
<button type="button" class="close" @click="exit"><img src="/images/close.png" alt=""></button>
</template>