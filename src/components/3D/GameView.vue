<script lang="ts">
import { PointLight, Box, Camera, Renderer, Scene, LambertMaterial } from 'troisjs';
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { InputController } from '../../models/InputController'

export default defineComponent({
  components: { Box, Camera, Renderer, Scene, PointLight, LambertMaterial },

  setup() {
    const renderer = ref();
    const box = ref();
    const camera = ref();
    const controller = new InputController(camera);

    onMounted(() => {
      renderer.value.onBeforeRender(() => {
        controller.updateRotation();
        controller.updateTranslation();
      });
    })

    return {
      renderer,
      camera,
      box,
      controller,
    }
  }
});
</script>

<template>
  <Renderer resize="window" ref="renderer">
    <Camera ref="camera" :position="{ x:0, y:0, z: 0 }" :look-at="{x: 0, y:0, z:-1}">
    </Camera>
    <Scene background="#4DBA87">
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box ref="box" :position="{x: 0, y:0, z:-5}">
        <LambertMaterial />
      </Box>
    </Scene>
  </Renderer>
</template>