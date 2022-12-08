<script lang="ts">
import THREE from 'three';
import { PointLight, Box, Camera, Renderer, Scene, LambertMaterial, GltfModel, AmbientLight,Plane,PhongMaterial } from 'troisjs';
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { FirstPersonCamera } from '../../models/FirstPersonCamera';
import { IGridElement } from '../../services/streetplaner/IGridElement';







export default defineComponent({
  components: { Box, Camera, Renderer, Scene,  GltfModel, AmbientLight,Plane,PhongMaterial},

  setup() {
    const renderer = ref();
    const box = ref();
    const camera = ref();
    const fpsCamera = new FirstPersonCamera(camera, box)
    let gridSizeX = 10;
    let gridSizeY = 10;
    const streetGrid: IGridElement[][] = reactive(Array(gridSizeX).fill([]).map(() => Array(gridSizeY).fill(null)));

    onMounted(() => {
      renderer.value.onBeforeRender(() => {
        fpsCamera.update();
      });
    })

    return {
      renderer,
      camera,
      box,
      fpsCamera,
      streetGrid
    }
  }
});
</script>

<template>
  <Renderer resize="window" ref="renderer">
    <Camera ref="camera" :position="{ x:0, y:0, z: 0 }" :look-at="{x: 0, y:0, z:-1}">
    </Camera>
    <Scene background="#4DBA87">
      <AmbientLight></AmbientLight>
     <!-- <GltfModel src="/../../../src/assets/3D_Models/Building/Haus.gltf" :position="{x: 0, y:0, z:0}" :scale="{x: 0.4, y:0.4, z:0.4}"/>-->
      <!--<GltfModel src="/../../../src/assets/3D_Models/Building/Haus - Hoch.gltf" :position="{x: -5, y:0, z:-15}" :scale="{x: 0.4, y:0.4, z:0.4}"/>-->
      <!-- <GltfModel src="/../../../src/assets/3D_Models/Building/Markt.gltf" :position="{x: 5, y:0, z:-15}" :scale="{x: 0.4, y:0.4, z:0.4}"/>-->
      <Plane :width="10" :height="10" :rotation="{x: -Math.PI /2}" :position="{x:0, y:0, z:0}" receive-shadow>
        <PhongMaterial color="#999999" :props="{ depthWrite: false }" /></Plane>
      
        <div v-for = "row in streetGrid">
            <div v-for="column in row">
              <Plane :width="1" :height="1" :rotation="{x: -Math.PI /2}" :position="{x:0, y:0, z:0}" receive-shadow>
              <PhongMaterial color="#FF0000" :props="{ depthWrite: false }" /></Plane>
            </div>
        </div>

      
     
    
    </Scene>
  </Renderer>
</template>