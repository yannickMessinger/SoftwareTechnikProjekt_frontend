<template>
  <h1>Menu</h1>
  <PrimButton display="Editor Mode" :btn_click="switchEditor"></PrimButton>
</template>

<script setup lang="ts">
  import PrimButton from '../components/PrimButton.vue';
  import router from '../router/router';

  function switchEditor(){
        router.push('/editor')
    }
</script>

<style>

</style>