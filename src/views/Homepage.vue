<template>
  <div class="homepage" style="margin-bottom: 350px">
    <h1> Homepage </h1>
    <button @click="switchToGameMode">Start the game</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "../router/router";
function switchToGameMode() {
  router.push("/gameMode3d");
}
export default defineComponent({
  name: "homepage",
  components: {},
  methods: {
    switchToGameMode,
  },
});
</script>

<style>
body {
  background-image: url("https://cdn.pixabay.com/photo/2020/05/24/20/42/new-york-5216115_1280.png");
  background-size: cover;
}
</style>