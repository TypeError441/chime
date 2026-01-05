<script setup>
import { useQuickLinks } from "../../../../composables/settings";
const quickLinks = useQuickLinks();

const props = defineProps({
    index: Number,
    quickLink: Object
});
</script>

<template>
<div
    class="item--quick-link button__contrast"
    :id="`settings-item-quick-link-${props.index}`"
>
    <div class="quick-link--title">
        <label :for="`title--input__${ props.index }}`">Name</label>
        <input type="text" class="title--input" :id="`title--input__${ props.index }}`" v-model.trim="props.quickLink.title" maxlength="16" />
    </div>
    <div class="quick-link--url">
        <label :for="`url--input__${ props.index }}`">URL</label>
        <input type="text" class="url--input" :id="`url--input__${ props.index }}`" v-model.trim="props.quickLink.url" />
    </div>
    <div class="quick-link--side">
        <label :for="`side--input__${ props.index }}`">Side</label>
        <div class="radio-item">
            <input type="radio" :id="`side--input__${ props.index }__left}`" :name="`side--input__${props.index}`" value="left" v-model="props.quickLink.side" />
            <label :for="`side--input__${ props.index }__left}`">Left</label>
        </div>
        <div class="radio-item">
            <input type="radio" :id="`side--input__${ props.index }__right}`" :name="`side--input__${props.index}`" value="right" v-model="props.quickLink.side" />
            <label :for="`side--input__${ props.index }__right}`">Right</label>
        </div>
    </div>
    <button class="quick-link--remove button button__danger" @click="quickLinks.splice(props.index, 1)">Remove</button>
</div>
</template>

<style scoped type="scss">
.item--quick-link {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 1em 0;
    padding: 1em;
    width: 80%;

    .quick-link--title, .quick-link--url, .quick-link--side {
        width: 100%;

        &.quick-link--side {
            display: flex;
            flex-direction: row;
            margin-bottom: 1em;
        }

        .title--input, .url--input {
            background-color: rgb(var(--background-color));
            color: rgb(var(--color));
            width: 100%;
            display: block;
            padding: 0.75em;
            margin-bottom: 1em;
            border: none;
        }
    }

    .quick-link--remove {
        width: 100%;
    }
}
</style>