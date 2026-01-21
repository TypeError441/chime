<script setup>
const model = defineModel();
</script>

<template>
<div class="item--feature feature__bool">
    <button class="feature--display button glass" @click="model = !model">
        <div class="display--handle glass" :class="{on: model}"></div>
    </button>
    <p>{{ model ? "On" : "Off" }}</p>
</div>
</template>

<style scoped type="scss">
.feature__bool {
    display: flex;
    flex-direction: row;
    align-items: center;

    .feature--display {
        --glass-color: var(--color);
        position: relative;
        width: 4rem;
        height: calc(2rem + 2px);

        .display--handle {
            --glass-color: 255, 255, 255;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgba(255, 255, 255, 0.7);
            width: 2rem;
            height: 2rem;
            padding: 0;
            border-radius: 50%;
            transition: left 0.2s ease-in-out;

            &.on {
                left: calc(100% - 2rem);
            }
        }
    }

    p {
        margin: 0 0 0 1rem;
    }
}
</style>