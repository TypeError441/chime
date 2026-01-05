<script setup>
const model = defineModel();
</script>

<template>
<button class="button" @click="model = !model">{{ model ? "Edit" : "Done"}}</button>
</template>