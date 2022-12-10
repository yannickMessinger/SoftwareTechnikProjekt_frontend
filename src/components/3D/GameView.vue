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
    let gridSizeX = 100;
    let gridSizeY = 100;
    let m=10
    let n = 10
    const streetGrid: IGridElement[][] = Array(m).fill([]).map(() => Array(n).fill(null));
    const fieldSize = 10;
    const buildingIDMap = new Map().set('haus','/../../../src/assets/3D_Models/Building/Markt.gltf');
    let path:string = '/../../../src/assets/3D_Models/Building/Markt.gltf';
    let intersection_path = '/../../../src/assets/3D_Models/Streets/straight_road.gltf'
    

    
  
    function initStreetGrid(){
     
      for(let row=0; row<streetGrid.length; row++) {
            for(let col=0; col<streetGrid[0].length; col++) {
              streetGrid[row][col] = {id:0, posX:row, posY:col, rotation: 0, texture:intersection_path};
            }
        
      }

      
      
    }

    initStreetGrid();


    function calcCoordinateX(n:number){
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

   

    return {
      renderer,
      camera,
      box,
      fpsCamera,
      streetGrid,
      calcCoordinateX,
      calcCoordinateZ,
      buildingIDMap,
      path
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
      <Plane :width="100" :height="100" :rotation="{x: -Math.PI /2}" :position="{x:0, y:0, z:0}" receive-shadow>
        <PhongMaterial color="#999999" :props="{ depthWrite: false }" /></Plane>
      
        
        <div v-for = "row in streetGrid">
          <div v-for ="column in row">
            
            <GltfModel v-bind:src="column.texture" :position="{x:calcCoordinateX(column.posX), y:0, z: calcCoordinateZ(column.posY)}" :scale="{x: 0.5, y:0.5, z:0.5}" :rotation="{x:0, y:0, z:0}"/>
          </div>    
        </div>
      

        

      
     
    
    </Scene>
  </Renderer>
</template>