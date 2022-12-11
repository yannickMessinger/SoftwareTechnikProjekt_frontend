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
    /*Defines the Grid Size in length by the number ob fields*/ 
    let gridSizeX = 100;
    /*Defines the Grid Size in height by the number ob fields*/ 
    let gridSizeY = 100;
    let m=10
    let n = 10
    /*Array of Buildings and Streets passed from 2D Planner*/
    const streetGrid: IGridElement[][] = Array(m).fill([]).map(() => Array(n).fill(null));
    const fieldSize = 10;
    /*Map of 3d-model paths*/
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

    /*Models position are saved from the Backend counting from 0 upwards.
      x:0, z:0 describes the upper left corner. On a 100 x 100 Field the lower right corner would be x:99, z: 99.
      On the 3d Game View the coordinates x:0, z:0 describes the center of our Grid. The upper left corner would be x:-50, z:-50.
      The following two methods calculate the Models position bades on the backend memory structure and adapts it to the frontend structure.*/

    /*Calculates X coordinates position of loaded Model */
    function calcCoordinateX(n:number){
      return (gridSizeX * (-0.5)) + (n * fieldSize) + (fieldSize / 2);
    }

    /*Calculates Z coordinates position of loaded Model */
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
      
        
        <!--All elements placed in the editor are read from the list and placed in the scene-->
        <div v-for = "row in streetGrid">
          <div v-for ="column in row">
            
            <GltfModel v-bind:src="column.texture" :position="{x:calcCoordinateX(column.posX), y:0, z: calcCoordinateZ(column.posY)}" :scale="{x: 0.5, y:0.5, z:0.5}" :rotation="{x:0, y:0, z:0}"/>
          </div>    
        </div>
      

        

      
     
    
    </Scene>
  </Renderer>
</template>