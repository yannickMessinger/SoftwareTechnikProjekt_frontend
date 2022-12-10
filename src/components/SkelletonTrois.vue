<script lang="ts">
import { PointLight, Box, Camera, Renderer, Scene, LambertMaterial, RendererPublicInterface, MeshPublicInterface } from 'troisjs';
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref, render } from 'vue';
import { MovmentInputController } from '../models/movmentInputController'

export default defineComponent({
  components: { Box, Camera, Renderer, Scene, PointLight, LambertMaterial },

  setup() {
    const renderer = ref();
    const box = ref();
    const camera = ref();
    const moveableObject = new MovmentInputController(box);

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
  <Renderer width="600" height="800" ref="renderer">
    <Camera ref="camera" :position="{ x:0, y:0, z: 0 }">
    </Camera>
    <Scene background="#4DBA87">
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box ref="box" :position="{x: 0, y:0, z:-5}">
        <LambertMaterial />
      </Box>
    </Scene>
  </Renderer>
</template>