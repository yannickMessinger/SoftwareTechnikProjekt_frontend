<script lang="ts">
import { PointLight, Box, Camera, Renderer, Scene, LambertMaterial, RendererPublicInterface, MeshPublicInterface } from 'troisjs';
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref, render } from 'vue';
import { MovmentInputController } from '../models/movmentInputController'

export default defineComponent({
  components: { Box, Camera, Renderer, Scene, PointLight, LambertMaterial },

  setup() {
    const rendererC = ref();
    const box = ref();
    const camera = ref();
    const moveableObject = new MovmentInputController(box);

    onMounted(() => {
      const renderer = rendererC.value as RendererPublicInterface;
      const mesh = (box.value as MeshPublicInterface).mesh
      renderer.onBeforeRender(() => {
        console.log(box.value.position);
        moveableObject.update();
        mesh!.position.z = box.value.position.z
        mesh!.position.x = box.value.position.x

        mesh!.rotation.y = box.value.rotation.y
      });
    })

    return {
      rendererC,
      camera,
      box,
      moveableObject,
    }
  }
});
</script>

<template>
  <Renderer antialias resize="window" ref="rendererC" :orbit-ctrl="{enableDamping: true}">
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