<script setup>
import { toRef, watchEffect } from "vue";
import ColorInput from "./ColorInput.vue";

const props = defineProps({
    name: String,
    type: String,
    obj: Object,
    model: String,
    min: Number,
    max: Number,
    step: Number,
    transparency: Boolean,
    transparencyModel: Boolean
});

const modelRef = toRef(props.obj, props.model);

const emit = defineEmits(["file"]);

watchEffect(() => {
    if (props.type === "number" && modelRef.value != null) {
        modelRef.value = Math.min(Math.max(Number(modelRef.value), props.min ?? 0), props.max ?? 1);
    }
});

function onFileChange(event) {
    const file = event.target.files?.[0] ?? null;
    emit("file", file);
}
</script>

<template>
<div class="custom-theme--item">
    <p class="item--name">{{ props.name }}</p>
    <input
        v-if="props.type === 'number'"
        type="number"
        v-model.number="modelRef"
        :min="min"
        :max="max"
        :step="step"
    >
    <input
        v-else-if="props.type === 'text'"
        type="text"
        v-model="modelRef"
        placeholder="none"
    >
    <input
        v-else-if="props.type === 'file'"
        type="file"
        accept="image/*"
        @change="onFileChange"
    />
    <ColorInput
        v-else-if="props.type === 'color'"
        v-model="modelRef"
        v-model:alpha="props.obj.radialTransparency"
        :transparency="props.transparency"
    />
    <input
        v-else
        :type="props.type"
        v-model="modelRef"
    >
</div>
</template>

<style scoped type="scss">
.custom-theme--item {
    display: flex;
    flex-direction: column;

    .item--name {
        width: 50%;
        margin: 1em 0 0.5em 0;
        padding: 0;
    }
}
</style>