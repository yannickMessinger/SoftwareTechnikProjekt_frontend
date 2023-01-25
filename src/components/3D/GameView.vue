<script lang="ts">
import { Box, Camera, Renderer, Scene, LambertMaterial, GltfModel, AmbientLight, Plane, PhongMaterial } from "troisjs"

import { computed, defineComponent, onMounted, ref } from "vue"
import { useGameView } from "../../services/3DGameView/useGameView"
import { MovmentInputController } from "../../models/MovementInputController"

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
        const moveableObject = new MovmentInputController(box, camera)
        const {
            gameState,
            setMapWidthAndMapHeight,
            resetGameMapObjects,
            updateMapObjsFromGameState,
            updatePosMessage,
            receiveNpcUpdates,
        } = useGameView()

        receiveNpcUpdates()

        //counter variables for loops to prefill map with dummy data
        const fieldSize = 10
        let mapWidth = 30
        let mapHeight = 20

        /*Defines the Grid Size in length by the number ob fields*/
        let gridSizeX = 300
        /*Defines the Grid Size in height by the number ob fields*/
        let gridSizeY = 200

        setMapWidthAndMapHeight(mapWidth, mapHeight)

        /*Map of 3d-model paths*/
        const buildingIDMap = new Map()
        buildingIDMap.set(0, "/../../../src/assets/3D_Models/Streets/straight_road.gltf")
        buildingIDMap.set(1, "/../../../src/assets/3D_Models/Streets/curved_road.gltf")
        buildingIDMap.set(2, "/../../../src/assets/3D_Models/Streets/intersection_road.gltf")
        buildingIDMap.set(3, "/../../../src/assets/3D_Models/Building/house_high.gltf")
        buildingIDMap.set(4, "/../../../src/assets/3D_Models/Building/house.gltf")
        buildingIDMap.set(5, "/../../../src/assets/3D_Models/Building/shop.gltf")
        buildingIDMap.set(17, "/../../../src/assets/3D_Models/Enviroment/enviroment_1.gltf")
        buildingIDMap.set(18, "/../../../src/assets/3D_Models/Enviroment/enviroment_2.gltf")
        buildingIDMap.set(19, "/../../../src/assets/3D_Models/Enviroment/enviroment_3.gltf")
        buildingIDMap.set(20, "/../../../src/assets/3D_Models/Enviroment/enviroment_4.gltf")
        buildingIDMap.set(21, "/../../../src/assets/3D_Models/Vehicles/taxi.gltf")
        buildingIDMap.set(22, "/../../../src/assets/3D_Models/Vehicles/car_1.gltf")
        buildingIDMap.set(23, "/../../../src/assets/3D_Models/Pedestrians/Firefighter.gltf")
        buildingIDMap.set(24, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBlondeBlack.gltf")
        buildingIDMap.set(25, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBlondeBlue.gltf")
        buildingIDMap.set(26, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBrowneBlue.gltf")
        buildingIDMap.set(27, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBlondeRed.gltf")
        buildingIDMap.set(28, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBrownPink.gltf")
        buildingIDMap.set(29, "/../../../src/assets/3D_Models/Pedestrians/pedestrianOrangeGreen.gltf")
        buildingIDMap.set(30, "/../../../src/assets/3D_Models/Pedestrians/pedestrianOrangeWhite.gltf")
        buildingIDMap.set(31, "/../../../src/assets/3D_Models/Pedestrians/pedestrianRed.gltf")
        buildingIDMap.set(32, "/../../../src/assets/3D_Models/Pedestrians/PoliceOfficer.gltf")

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

        resetGameMapObjects()
        gameState.npcCarMapFromuseGameview.clear()

        /*Array of Buildings and Streets passed from 2D Planner*/
        const mapElements = computed(() => gameState.gameMapObjects)
        const npcEles = computed(() => gameState.npcCarMapFromuseGameview)

        /*Models position are saved from the Backend counting from 0 upwards.
      x:0, z:0 describes the upper left corner. On a 100 x 100 Field the lower right corner would be x:99, z: 99.
      On the 3d Game View the coordinates x:0, z:0 describes the center of our Grid. The upper left corner would be x:-50, z:-50.
      The following two methods calculate the Models position bades on the backend memory structure and adapts it to the frontend structure.*/

        /*Calculates X coordinates position of loaded Model */
        function calcCoordinateX(n: number) {
            let x = gridSizeX * -0.5 + n * fieldSize + fieldSize / 2
            //console.log(`GameObj x: ${x}`)
            return x
        }

        /*Calculates Z coordinates position of loaded Model */
        function calcCoordinateZ(n: number) {
            let z = gridSizeY * -0.5 + n * fieldSize + fieldSize / 2
            //console.log(`GameObj z: ${z}`)
            return z
        }

        onMounted(() => {
            updateMapObjsFromGameState()

            renderer.value.onBeforeRender(() => {
                moveableObject.update()

                npcEles.value.forEach((ele) => {
                    if (ele.driving) {
                        ele.drive()
                    }
                })
            })

            setInterval(() => {
                npcEles.value.forEach((ele) => {
                    console.log(ele.reachedMapEleLimit())
                    if (ele.reachedMapEleLimit()) {
                        console.log(`ele mit ${ele.npcId} braucht POS Update!`)
                        updatePosMessage(ele.npcId)
                    }
                })
            }, 300)
        })

        return {
            npcEles,
            renderer,
            camera,
            box,
            moveableObject,
            calcCoordinateX,
            calcCoordinateZ,
            buildingIDMap,
            mapElements,
            rotationMap,
            gridSizeX,
            gridSizeY,
            fieldSize,
        }
    },
})
</script>

<template>
    <Renderer resize="window" ref="renderer">
        <Camera ref="camera" :position="{ x: 0, y: 0, z: 0 }" :look-at="{ x: 0, y: 0, z: -1 }"> </Camera>
        <Box ref="box" :position="{ x: 0, y: 5, z: 0 }"></Box>
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

            <div v-for="asset in npcEles">
                <GltfModel
                    v-bind:src="buildingIDMap.get(22)"
                    :position="{
                        x: asset[1].positions.npcPosX,
                        y: 0.75,
                        z: asset[1].positions.npcPosZ,
                    }"
                    :scale="{ x: 0.5, y: 0.5, z: 0.5 }"
                    :rotation="{
                        x: 0,
                        y: asset[1].viewRotation,
                        z: 0,
                    }"
                />
            </div>
        </Scene>
    </Renderer>
</template>
