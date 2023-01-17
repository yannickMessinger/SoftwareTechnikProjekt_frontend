<template>
    <Header text="World of eMobility" :displayHomebutton="true"></Header>
    <div class="container" id="game-view">
        <div class="box">
            <SkelletonTrois></SkelletonTrois>
        </div>
        <div class="box overlay">
            <HUD></HUD>
        </div>
        <Chat />
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import SkelletonTrois from "../components/3D/GameView.vue"
import HUD from "../components/3D/HUD.vue"
import Header from "../components/Header.vue"
import Chat from "../components/UI/Chat.vue"
</script>

<style scoped>
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
    cursor: none;
}

.overlay {
    z-index: 9;
}
</style>
