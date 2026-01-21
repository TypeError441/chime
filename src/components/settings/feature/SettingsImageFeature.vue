<script setup>
import { ref, watch } from "vue";

const model = defineModel({ type: [Blob, null] });

const fileInput = ref(null);
const previewUrl = ref(null);

function openPicker() {
    fileInput.value?.click();
}

function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    model.value = file;
}

function clearImage() {
    model.value = null;
}

watch(model, (newVal) => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = null;
    }

    if (newVal instanceof Blob) {
        previewUrl.value = URL.createObjectURL(newVal);
    }
}, { immediate: true });
</script>

<template>
    <div class="item--feature feature__image">
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            hidden
            @change="onFileChange"
        />

        <button
            class="feature--display button glass"
            type="button"
            @click="openPicker"
        >
            <img v-if="previewUrl" :src="previewUrl" />
            <span v-else>Upload</span>
        </button>

        <button
            v-if="model"
            class="feature--display button glass"
            type="button"
            @click="clearImage"
        >
            Clear
        </button>
    </div>
</template>

<style scoped lang="scss">
.feature__image {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;

    .feature--display {
        --glass-color: var(--color);
        position: relative;
        width: 4rem;
        height: calc(2rem + 2px);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}
</style>