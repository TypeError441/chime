<script setup>
import { computed } from "vue";

import { useAppearance } from "../../composables/settings";
import { useApplySettings } from "../../composables/apply";

const appearance = useAppearance();
const { getTheme } = useApplySettings();

const theme = getTheme();

const images = computed(() => {
    if (theme.meta?.version == undefined) {
        if (appearance.theme == "custom") {
                if (theme.backgroundImage) {
                    return [
                        {
                            "path": theme.backgroundImage,
                            "position": [0, 0],
                            "scale": 10.0
                        }
                    ];
                } else {
                    return [];
                }
        } else {
            if (theme.backgroundImage != "") {
                return [
                    {
                        "path": theme.backgroundImage,
                        "position": [0, 0],
                        "scale": 10.0
                    }
                ];
            } else {
                return [];
            }
        }
    }
    else if (theme.meta?.version >= 2) {
        if (!theme.useBackgroundImage) return [];

        return theme.backgroundImages;
    }
});    

const backgroundCoverImage = computed(() => {
    return images.value.find(img => img.scale === 10 && img.position[0] == 0 && img.position[1] == 0) || null;
});

const foregroundImages = computed(() => {
    return images.value.filter(img => img.scale !== 10 || img.position[0] != 0 || img.position[1] != 0);
});
</script>

<template>
    <div
        id="background--images"
        :style="backgroundCoverImage ? {
            backgroundImage: `url(${backgroundCoverImage.path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%'
        } : {}"
    >
        <img
            class="background--image"
            v-for="image in foregroundImages"
            :key="image.path"
            :src="image.path"
            :style="{
                top: `${50 + image.position[1]}%`,
                left: `${50 + image.position[0]}%`,
                width: `${image.scale * 10}vmax`
            }"
        >
    </div>
</template>

<style>
#background--images {
    width: 100%;
    
    .background--image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>