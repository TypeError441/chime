<script setup>
import { useQuickLinks } from "../../../composables/settings";

const quickLinks = useQuickLinks();

const props = defineProps({
    index: Number,
    quickLink: Object
});
</script>

<template>
<div
    class="item--quick-link glass"
    :id="`settings-item-quick-link-${props.index}`"
>
    <div class="quick-link--title">
        <label :for="`title--input__${ props.index }}`">Name</label>
        <input type="text" class="title--input glass__child" :id="`title--input__${ props.index }}`" v-model.trim="props.quickLink.title" maxlength="16" />
    </div>
    <div class="quick-link--url">
        <label :for="`url--input__${ props.index }}`">URL</label>
        <input type="text" class="url--input glass__child" :id="`url--input__${ props.index }}`" v-model.trim="props.quickLink.url" />
    </div>
    <button class="quick-link--remove button button__danger glass" @click="quickLinks.splice(props.index, 1)">×</button>
</div>
</template>

<style scoped type="scss">
.item--quick-link {
    --glass-color: var(--radial-background-color);

    position: relative;
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    margin: 1em 0;
    padding: 1em;
    width: 100%;

    .quick-link--title, .quick-link--url {
        width: 90%;

        label {
            display: block;
            margin-bottom: 0.5em;
            font-weight: bold;
        }

        .title--input, .url--input {
            --glass-color: var(--color);
            color: white;
            width: 100%;
            display: block;
            padding: 0.75em;
            margin-bottom: 1em;
            border: none;
        }
    }

    .quick-link--remove {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 100%;
        color: white;
        width: 3rem;
        height: 3rem;
    }
}
</style>