<template>
    <h2>Editor</h2>
    <PrimButton display="Back to menu" :btn_click="backToMenu"></PrimButton>
</template>

<script setup lang="ts">
    import { computed,ref } from 'vue'
    import PrimButton from '../components/PrimButton.vue'
    import router from '../router/router'

    function backToMenu(){
        router.push('/')
    }
</script>

<style>

</style>