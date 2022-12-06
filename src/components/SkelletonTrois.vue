<template>
  <Renderer ref="rendererC" antialias resize >
    <Camera :position="{ z: 10 }" ref="camera"/>
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box :size="1" :position="{x:0,y:2,z:0}" ref="meshC" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <LambertMaterial />
      </Box>
      <GroundPlane></GroundPlane>
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import GroundPlane from "./Plane.vue"
import { MovmentInputController } from "../models/movmentInputController";
import { ref, onMounted } from 'vue'
import * as THREE from "three";
import { Box, Group, Camera, LambertMaterial, MeshPublicInterface, PointLight, Renderer, RendererPublicInterface, Scene } from 'troisjs'

const rendererC = ref()
const meshC = ref()
const camera = ref()



const moveableObject = new MovmentInputController(meshC)

onMounted(() => {
  rendererC.value.onBeforeRender(() => {
    moveableObject.update();
    camera.value.position.z += 0.1;
    console.log(camera.value.position);
  })
  rendererC.value.onAfterRender(()=>{
    
  })
})
</script>

<style>

</style>