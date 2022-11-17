<script setup lang="ts">
import PrimaryButton from './Buttons/PrimaryButton.vue';

</script>

<template>
    <div class="site_bar">
        <div class="site_bar_section">
            <PrimaryButton name="Editor" linkTo=/editor />
            <PrimaryButton name="START" linkTo=/start />
            <PrimaryButton name="Chat" linkTo=/chat />
        </div>
        <div class="site_bar_section">
            <PrimaryButton name="Spiel schließen" linkTo=/close />
        </div>
    </div>
</template>

<style>
body {
    display: block;
    min-width: 670px;
}
.site_bar {
    /* container fuer flexbox in horizontaler Ausrichtung */
    display: flex;
    justify-content: space-between;

    padding: 10px;
    background-color: #555;
}

.site_bar_section {
    display: flex;
    align-items: center;
}

</style>
