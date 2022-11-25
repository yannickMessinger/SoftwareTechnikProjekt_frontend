<script lang="ts">
import { PointLight, Box, Camera, Renderer, Scene, LambertMaterial, GltfModel, AmbientLight } from 'troisjs';
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { FirstPersonCamera } from '../../models/FirstPersonCamera'

export default defineComponent({
  components: { Box, Camera, Renderer, Scene, PointLight, LambertMaterial, GltfModel, AmbientLight },

  setup() {
    const renderer = ref();
    const box = ref();
    const camera = ref();
    const fpsCamera = new FirstPersonCamera(camera, box)

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
      <GltfModel src="/../../../src/assets/3D_Models/Building/Haus.gltf" :position="{x: 0, y:0, z:-15}" :scale="{x: 0.4, y:0.4, z:0.4}"/>
      <GltfModel src="/../../../src/assets/3D_Models/Building/Haus - Hoch.gltf" :position="{x: -5, y:0, z:-15}" :scale="{x: 0.4, y:0.4, z:0.4}"/>
      <GltfModel src="/../../../src/assets/3D_Models/Building/Markt.gltf" :position="{x: 5, y:0, z:-15}" :scale="{x: 0.4, y:0.4, z:0.4}"/>
    </Scene>
  </Renderer>
</template>