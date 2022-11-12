<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import StreetListTestside from './components/streetplaner/StreetListTestside.vue'

</script>

<template>
  <h1 class="title">Street List Testside</h1>
  <br/>
  <div class="streetList">
    <StreetListTestside></StreetListTestside>
  </div>
</template>

<style scoped>
.title {
  color:black;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

</style>
