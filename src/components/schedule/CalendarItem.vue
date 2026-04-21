<script setup>
defineProps({
    period: Object,
    top: Number,
    height: Number,
    displayName: String,
    timeLabel: String,
});
</script>

<template>
    <div
        class="schedule--item glass glass__child"
        :style="{ top: `${top}px`, height: `${height}px` }"
    >
        <div class="item--left"></div>
        <div class="item--content">
            <div class="item--name">{{ displayName }}</div>,&nbsp;
            <div class="item--time">{{ timeLabel }}</div>
        </div>
    </div>
</template>

<style scoped type="scss">
.schedule--item {
    --glass-color: var(--secondary-accent-color);
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: row;
    width: 83%;
    color: rgb(var(--color));
    right: 0;
    border-radius: 0.4em;

    .item--left {
        border-radius: 0.4em 0 0 0.4em;
        height: 100%;
        width: 0.4em;
        background-color: rgb(var(--background-color));
    }

    .item--content {
        margin: min(1em, 2%);
        display: flex;
        flex-direction: row;
        font-size: 0.8rem;

        .item--name {
            font-weight: 600;
        }

        .item--time {
            font-style: italic;
        }
    }
}
</style>