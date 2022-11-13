<script lang="ts">
import { PointLight, Box, Camera, Renderer, Scene, LambertMaterial } from 'troisjs';
import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';

export default defineComponent({
  components: { Box, Camera, Renderer, Scene, PointLight, LambertMaterial },

  setup() {
    const renderer = ref();
    const box = ref();
    const camera = ref();

    onBeforeMount(() => {
      window.addEventListener("keypress", movementKeyboard)
    }),

    onBeforeUnmount(() => {
      window.removeEventListener("keypress", movementKeyboard)
    }),

    onMounted(() => {
        renderer.value?.onBeforeRender(() => {
        });
    })

    function movementKeyboard(e: KeyboardEvent) {
      if (e.key == "w") {
          camera.value.camera.position.z -= 0.1
          box.value.mesh.position.z -= 0.1;
        }
        if (e.key == "a") {
          camera.value.camera.position.x += 0.01
          box.value.mesh.position.x += 0.01;
        }
        if (e.key == "s") {
          camera.value.camera.position.z += 0.1
          box.value.mesh.position.z += 0.1;
        }
        if (e.key == "d") {
          camera.value.camera.position.x -= 0.01
          box.value.mesh.position.x -= 0.01;
        }
    }

    return {
      renderer,
      camera,
      box
    }
  }
});
</script>

<template>
  <Renderer width="1280" height="720" ref="renderer">
    <Camera ref="camera" :position="{ z: 10 }">
    </Camera>
    <Scene background="#4DBA87">
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box ref="box">
        <LambertMaterial />
      </Box>
    </Scene>
  </Renderer>
</template>