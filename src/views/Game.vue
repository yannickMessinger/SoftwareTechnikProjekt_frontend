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

<script lang='ts'>
import { defineComponent } from 'vue'
import SkelletonTrois from "../components/3D/GameView.vue"
import GameMenu from "../components/3D/GameMenu.vue"
import HUD from "../components/3D/HUD.vue"

export default defineComponent({
    name: 'Game',
    components: {
        GameMenu,
        SkelletonTrois,
        HUD,
        },
    })
</script>

<style>

.container {
  width: 1280px;
  height: 720px;
  position: relative;
}

.box {
  width: 1280px;
  height: 720px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
}

.overlay {
  z-index: 9;
}
</style>