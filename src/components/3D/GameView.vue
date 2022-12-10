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
    let gridSizeX = 40;
    let gridSizeY = 40;
    const streetGrid: IGridElement[][] = reactive(Array(gridSizeX).fill([]).map(() => Array(gridSizeY).fill(null)));
    const fieldSize = 4;
    const buildingIDMap = new Map().set('haus','/../../../src/assets/3D_Models/Building/Markt.gltf');
    let path:string = '/../../../src/assets/3D_Models/Building/Markt.gltf';
    let intersection_path = '/../../../src/assets/3D_Models/Streets/intersection_road.gltf'
    let testArr:any = []
  
    function initTestArray(){
      
      for(let i=0; i<10; i++){
        testArr.push({x:i,z:0, path:intersection_path})
      }
      
    }

    initTestArray();


    function calcCoordinateX(n:number){
      console.log(`n:${n}`)
      console.log((gridSizeX * (-0.5)) + (n * fieldSize) + (fieldSize / 2))
      return (gridSizeX * (-0.5)) + (n * fieldSize) + (fieldSize / 2);
    }

    function calcCoordinateZ(n:number){
      return (gridSizeY * (-0.5)) + (n * fieldSize) + (fieldSize / 2);
    }

    onMounted(() => {
      renderer.value.onBeforeRender(() => {
        fpsCamera.update();
      });
    })

    console.log(testArr);

    return {
      renderer,
      camera,
      box,
      fpsCamera,
      streetGrid,
      calcCoordinateX,
      calcCoordinateZ,
      buildingIDMap,
      path,
      testArr
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
      <Plane :width="40" :height="40" :rotation="{x: -Math.PI /2}" :position="{x:0, y:0, z:0}" receive-shadow>
        <PhongMaterial color="#999999" :props="{ depthWrite: false }" /></Plane>
      
        
        <div v-for = "building in testArr">
            
              <!--<Plane :width="4" :height="4" :rotation="{x: -Math.PI /2}" :position="{x:calcCoordinateX(n), y:0, z:-18}" receive-shadow>
              <PhongMaterial color="#FF0000" :props="{ depthWrite: false }" /></Plane>-->
              <GltfModel v-bind:src="building.path" :position="{x:calcCoordinateX(building.x), y:0.5, z: calcCoordinateZ(building.z)}" :scale="{x: 0.05, y:0.05, z:0.05}" :rotation="{x:0, y:0, z:0}"/>
              
        </div>
        

        

      
     
    
    </Scene>
  </Renderer>
</template>