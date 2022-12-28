<script lang="ts">
    import {
        PointLight,
        Box,
        Camera,
        Renderer,
        Scene,
        LambertMaterial,
        GltfModel,
        AmbientLight,
        Plane,
        PhongMaterial,
    } from "troisjs"
    import {
        computed,
        defineComponent,
        onBeforeMount,
        onBeforeUnmount,
        onMounted,
        reactive,
        ref,
    } from "vue"
    import { FirstPersonCamera } from "../../models/FirstPersonCamera"
    import { useGameView } from "../../services/3DGameView/useGameView"

    export default defineComponent({
        components: {
            Box,
            Camera,
            Renderer,
            Scene,
            GltfModel,
            AmbientLight,
            Plane,
            PhongMaterial,
        },

        setup() {
            const renderer = ref()
            const box = ref()
            const camera = ref()
            const fpsCamera = new FirstPersonCamera(camera, box)

            /*Defines the Grid Size in length by the number ob fields*/
            let gridSizeX = 100
            /*Defines the Grid Size in height by the number ob fields*/
            let gridSizeY = 100

            let m = 10
            let n = 10

            useGameView().setMapWidthAndMapHeight(m, n)
            /*Array of Buildings and Streets passed from 2D Planner*/

            const fieldSize = 10
            /*Map of 3d-model paths*/
            const buildingIDMap = new Map()
            buildingIDMap.set(
                0,
                "/../../../src/assets/3D_Models/Streets/straight_road.gltf"
            )
            buildingIDMap.set(
                1,
                "/../../../src/assets/3D_Models/Streets/curved_road.gltf"
            )
            buildingIDMap.set(
                2,
                "/../../../src/assets/3D_Models/Streets/intersection_road.gltf"
            )
            buildingIDMap.set(
                3,
                "/../../../src/assets/3D_Models/Building/house_high.gltf"
            )
            buildingIDMap.set(
                4,
                "/../../../src/assets/3D_Models/Building/house.gltf"
            )
            buildingIDMap.set(
                5,
                "/../../../src/assets/3D_Models/Building/shop.gltf"
            )
            buildingIDMap.set(
                17,
                "/../../../src/assets/3D_Models/Enviroment/enviroment_1.gltf"
            )
            buildingIDMap.set(
                18,
                "/../../../src/assets/3D_Models/Enviroment/enviroment_2.gltf"
            )
            buildingIDMap.set(
                19,
                "/../../../src/assets/3D_Models/Enviroment/enviroment_3.gltf"
            )
            buildingIDMap.set(
                20,
                "/../../../src/assets/3D_Models/Enviroment/enviroment_4.gltf"
            )

            /*Riadians is used to rotate Models. The following map set the radians for the passed rotation value from backend*/
            const rotationMap = new Map()
            /*No rotation*/
            rotationMap.set(0, 0)
            /*90 degree rotation*/
            rotationMap.set(1, (3 * Math.PI) / 2)
            /*180 degree rotation*/
            rotationMap.set(2, Math.PI)
            /*270 degree rotation*/
            rotationMap.set(3, Math.PI / 2)

            useGameView().resetGameMapObjects()

            const mapElements = computed(
                () => useGameView().gameState.gameMapObjects
            )

            /*Models position are saved from the Backend counting from 0 upwards.
      x:0, z:0 describes the upper left corner. On a 100 x 100 Field the lower right corner would be x:99, z: 99.
      On the 3d Game View the coordinates x:0, z:0 describes the center of our Grid. The upper left corner would be x:-50, z:-50.
      The following two methods calculate the Models position bades on the backend memory structure and adapts it to the frontend structure.*/

            /*Calculates X coordinates position of loaded Model */
            function calcCoordinateX(n: number) {
                //console.log((gridSizeX * (-0.5)) + (n * fieldSize) + (fieldSize / 2))
                return gridSizeX * -0.5 + n * fieldSize + fieldSize / 2
            }

            /*Calculates Z coordinates position of loaded Model */
            function calcCoordinateZ(n: number) {
                //console.log((gridSizeY * (-0.5)) + (n * fieldSize) + (fieldSize / 2))
                return gridSizeY * -0.5 + n * fieldSize + fieldSize / 2
            }

            onMounted(() => {
                useGameView().updateMapObjsFromGameState()

                renderer.value.onBeforeRender(() => {
                    fpsCamera.update()
                })
            })

            return {
                renderer,
                camera,
                box,
                fpsCamera,
                calcCoordinateX,
                calcCoordinateZ,
                buildingIDMap,
                mapElements,
                rotationMap,
                gridSizeX,
                gridSizeY,
            }
        },
    })
</script>

<template>
    <Renderer resize="window" ref="renderer">
        <Camera
            ref="camera"
            :position="{ x: 0, y: 0, z: 0 }"
            :look-at="{ x: 0, y: 0, z: -1 }"
        >
        </Camera>
        <Scene background="#87CEEB">
            <AmbientLight></AmbientLight>
            <Plane
                :width="gridSizeX"
                :height="gridSizeY"
                :rotation="{ x: -Math.PI / 2 }"
                :position="{ x: 0, y: 0, z: 0 }"
                receive-shadow
            >
                <PhongMaterial color="#999999" :props="{ depthWrite: false }"
            /></Plane>

            <!--  <GltfModel src='/../../../src/assets/3D_Models/Streets/straight_road_rotated.gltf' :position="{x:0, y:0, z:45}" :scale="{x: 0.5, y:0.5, z:0.5}" :rotation="{x:0, y:0, z:0}"/>-->

            <!--<div v-for="ele in enviroment">
        <GltfModel v-bind:src="buildingIDMap.get(ele.objectTypeId)" :position="{x:calcCoordinateX(ele.y), y:0, z: calcCoordinateZ(ele.x)}" :scale="{x: 0.5, y:0.5, z:0.5}" :rotation="{x:0, y:rotationMap.get(ele.rotation), z:0}"/>
       </div>-->

            <!-- All elements placed in the editor are read from the list and placed in the scene-->
            <div v-for="ele in mapElements">
                <GltfModel
                    v-bind:src="buildingIDMap.get(ele.objectTypeId)"
                    :position="{
                        x: calcCoordinateX(ele.y),
                        y: 0,
                        z: calcCoordinateZ(ele.x),
                    }"
                    :scale="{ x: 0.5, y: 0.5, z: 0.5 }"
                    :rotation="{ x: 0, y: rotationMap.get(ele.rotation), z: 0 }"
                />
            </div>
        </Scene>
    </Renderer>
</template>
