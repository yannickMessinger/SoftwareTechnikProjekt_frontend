<script lang="ts">
import { PointLight, Box, Camera, Renderer, Scene, LambertMaterial} from 'troisjs';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  components: { Box, Camera, Renderer, Scene, PointLight, LambertMaterial },

  setup() {
    const renderer = ref();
    const box = ref();
    const camera = ref();

    
    onMounted(() => {
        renderer.value?.onBeforeRender(() => {
            box.value.mesh.rotation.x += 0.01;
        });
    })

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