<template>
  <div class="GameMode3d" style="margin-bottom: 350px">
    <h1> GameMode </h1>
    <button @click="switchToHomepage">Left the game</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "../router/router";
function switchToHomepage() {
  router.push("/homepage");
}
export default defineComponent({
  name: "GameMode3d",
  components: {},
  methods: {
    switchToHomepage,
  },
});
</script>

<style>
body {
  background-image: url("https://cdn.pixabay.com/photo/2020/05/24/20/42/new-york-5216115_1280.png");
  background-size: cover;
}
</style>