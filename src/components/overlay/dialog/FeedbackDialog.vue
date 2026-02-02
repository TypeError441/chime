<script setup>
import { ref } from "vue";

import { useId } from "../../composables/settings";
import pkg from "../../../../package.json";

const id = useId();
const version = ref(pkg.version);

const emit = defineEmits(["close"]);

const feedbackText = ref("");

function submit() {
    if(feedbackText.length > 0) {
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'form-name': 'feedback',
                'feedback-modal': `v:${version},i:${id},f:${feedbackText}`
            })
        });
    }

    emit("close");
}

function exit() {
    emit("close");
}
</script>

<template>
<form name="feedback" id="feedback-modal" netlify>
    <div id="feedback--title">Feedback</div>
    <div id="feedback--subtitle">If you have questions, tell me your name or ask irl (I can't answer through the website)</div>
    <textarea name="feedback-modal" id="feedback--textarea" maxlength="200" v-model.trim="feedbackText"></textarea>
    <div id="feedback--choice-area">
        <button type="submit" class="button" @click="submit">Submit</button>
        <button type="button" class="button button__danger" @click="exit">Exit</button>
    </div>
</form>
</template>

<style scoped type="scss">
#feedback-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50vh;
    left: 50vw;
    width: 50vw;
    height: 50vh;
    transform: translate(-50%, -50%);
    background-color: rgb(var(--background-color));
    padding: 1em;
    border-radius: 0.5em;
    text-align: left;
    pointer-events: all;

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
        width: 100%;
        background-color: rgb(var(--radial-background-color));
        color: rgb(var(--color));
        border: none;
        resize: none;
        margin: 1em 0;
    }

    #feedback--choice-area {
        flex-grow: 0;
        display: flex;
        flex-direction: row;
        width: 100%;

        .button {
            flex: 1;
            margin: 0 0.25em;
            width: 100%;
        }
    }
}
</style>