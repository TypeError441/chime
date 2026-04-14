<script setup>
import { useCurrentDialog } from "../../composables/settings";

const props = defineProps({
    back: { type: String, default: "none" }
});

const currentDialog = useCurrentDialog();

function exit() {
    currentDialog.value = props.back;
}
</script>

<template>
<button type="button" class="close" @click="exit"><img src="/images/close.png" alt=""></button>
</template>