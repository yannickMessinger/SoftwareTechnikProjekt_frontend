<template>
    <div id="game-menu">
        <GameMenu></GameMenu>
    </div>
        <div class="container" id="game-view">
            <div class="box">
                <SkelletonTrois></SkelletonTrois>
            </div>
            <div class="box overlay">
                <HUD></HUD>
            </div>
        </div>
</template>

<script setup lang='ts'>
import { defineComponent } from 'vue'
import SkelletonTrois from "../components/3D/GameView.vue"
import GameMenu from "../components/3D/GameMenu.vue"
import HUD from "../components/3D/HUD.vue"


</script>

<style>

.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
}

.overlay {
  z-index: 9;
}
</style>