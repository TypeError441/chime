<script setup>
import { ref } from "vue";

import { useId } from "../../../composables/settings";
import pkg from "../../../../package.json";

import CloseDialog from "../CloseDialog.vue";
import { useCurrentDialog } from "../../../composables/settings";

const id = useId();
const version = ref(pkg.version);

const emit = defineEmits(["close"]);

const currentDialog = useCurrentDialog();

const feedbackText = ref("");

function submit() {
    if(feedbackText.value.length > 0) {
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'form-name': 'feedback',
                'version': `${version.value}`,
                'id': `${id.value}`,
                'content': `${feedbackText.value}`
            })
        });
    }

    currentDialog.value = "none";
}
</script>

<template>
<dialog id="overlay--dialog__feedback" class="overlay--dialog glass" :open="currentDialog == 'feedback'">
    <form name="feedback" id="feedback-modal" @submit.prevent="submit" data-netlify="true">
        <CloseDialog />
        <div id="feedback--title">Feedback</div>
        <div id="feedback--subtitle">If you have questions, tell me your name or ask irl (I can't answer through the website)</div>
        <input type="text" name="version" hidden>
        <input type="text" name="id" hidden>
        <textarea name="feedback-modal" id="feedback--textarea" class="glass glass__child" maxlength="200" v-model.trim="feedbackText"></textarea>
        <button type="submit" class="button glass glass__child">Submit</button>
    </form>
</dialog>
</template>

<style scoped type="scss">
#feedback-modal {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 1em;
    border-radius: 0.5em;
    text-align: left;
    padding: 2rem;
    color: rgb(var(--color));

    * {
        flex: 1;
    }

    #feedback--title {
        font-size: max(2vw, 2em);
        font-weight: bold;
        flex-grow: 0;
        text-align: left;
    }

    #feedback--subtitle {
        flex-grow: 0;
    }

    #feedback--textarea {
        --glass-color: var(--radial-background-color) !important;
        width: 100%;
        padding: 2em;
        resize: none;
        margin: 1em 0;
        color: rgb(var(--color));
    }

    .button {
        flex: 0;
        margin: 0 0.25em;
        width: 10rem;
    }
}
</style>