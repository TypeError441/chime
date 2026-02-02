<script setup>
import { useCustomtheme } from "../../../composables/settings";

import SettingsBoolFeature from "./SettingsBoolFeature.vue";
import SettingsRangeFeature from "./SettingsRangeFeature.vue";
import SettingsImageFeature from "./SettingsImageFeature.vue";

const customtheme = useCustomtheme();

</script>

<template>
<div id="item--background-images">
    <div class="item--subtitle">Images</div>
    <SettingsBoolFeature
        v-model="customtheme.useBackgroundImage"
    />
    <div v-if="customtheme.useBackgroundImage">
        <div
            v-for="(image, index) in customtheme.backgroundImages"
            class="item--image glass"
            :id="`settings-item-image-${index}`"
        >
            <div class="image--image">
                <label>Image</label>
                <SettingsImageFeature
                    v-model="image.blob"
                    v-model:path="image.path"
                />
            </div>
            <div class="image--position">
                <label>Position</label>
                <SettingsRangeFeature
                    :min="-50"
                    :max="50"
                    :step="1"
                    v-model="image.position[0]"
                    label="percent"
                />
                <SettingsRangeFeature
                    :min="-50"
                    :max="50"
                    :step="1"
                    v-model="image.position[1]"
                    label="percent"
                />
            </div>
            <div class="image--scale">
                <label>Scale</label>
                <SettingsRangeFeature
                    :min="0.01"
                    :max="10"
                    :step="0.01"
                    v-model="image.scale"
                />
            </div>
            <button class="image--remove button button__danger glass" @click="customtheme.backgroundImages.splice(index, 1)">×</button>
        </div>
        <button id="item--add-background-image" class="button button__success glass" @click="customtheme.backgroundImages.push({ path: null, position: [0, 0], scale: 1.0 })">+ Add</button>
    </div>
</div>
</template>

<style scoped type="scss">
#item--add-background-image {
    color: white;
    width: fit-content;
    padding: 0 2rem;
    height: 3rem;
}

.item--image {
    --glass-color: var(--radial-background-color);

    position: relative;
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    margin: 1em 0;
    padding: 1em;
    width: 100%;

    .image--image, .image--position, .image--scale {
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

    .image--remove {
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