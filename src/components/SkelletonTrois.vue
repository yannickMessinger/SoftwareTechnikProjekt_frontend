<script lang="ts">
import { AmbientLight, Box, Camera, Renderer, Scene, LambertMaterial, RendererPublicInterface, MeshPublicInterface, GltfModel } from 'troisjs';
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref, render } from 'vue';
import { MovmentInputController } from '../models/MovmentInputController'

export default defineComponent({
  components: { Box, Camera, Renderer, Scene, AmbientLight, LambertMaterial, GltfModel },

  setup() {
    const renderer = ref();
    const box = ref();
    const camera = ref();
    const moveableObject = new MovmentInputController(box, camera);

    onMounted(() => {
      renderer.value.onBeforeRender(() => {
        moveableObject.update();
      });
    })

    return {
      renderer,
      camera,
      box,
      moveableObject,
    }
  }
});
</script>

<template>
  <Renderer antialiasing="true" width="1200" height="800" ref="renderer">
    <Camera ref="camera" :position="{ x:0, y:1, z: 4 }">
    </Camera>
    <Scene background="#4DBA87">
      <AmbientLight></AmbientLight>
      <Box ref="box" :position="{x: 0, y:0, z:1}">
        <LambertMaterial />
      </Box>
      <GltfModel src="/../../../src/assets/3D_Models/Building/Haus.gltf" :position="{x: 5, y:0, z:-15}" :scale="{x: 0.4, y:0.4, z:0.4}"/>
    </Scene>
  </Renderer>
</template>