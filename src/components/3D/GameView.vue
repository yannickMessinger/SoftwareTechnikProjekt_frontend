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
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from "vue"
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
        const { gameState, setMapWidthAndMapHeight, resetGameMapObjects, updateMapObjsFromGameState } = useGameView()
        console.log(`Gamestate sizex ${gameState.sizeX}, sizey: ${gameState.sizeY}, fieldSize: ${gameState.fieldSize}`)
        console.log(gameState.sizeX * gameState.fieldSize)
        console.log(gameState.sizeY * gameState.fieldSize)

        //counter variables for loops to prefill map with dummy data
        let mapWidth = 30
        let mapHeight = 20

        setMapWidthAndMapHeight(mapWidth, mapHeight)

        const fieldSize = 10

        /*Defines the Grid Size in length by the number ob fields*/
        let gridSizeX = fieldSize * 30
        /*Defines the Grid Size in height by the number ob fields*/
        let gridSizeY = fieldSize * 20
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

        /*Riadians is used to rotate game assets. The following map set the radians for the passed rotation value from backend*/
        const assetRotationMap = new Map()

        /*No rotation*/
        assetRotationMap.set(0, Math.PI)
        /*90 degree rotation*/
        assetRotationMap.set(1, Math.PI / 2)
        /*180 degree rotation*/
        assetRotationMap.set(2, 0)
        /*270 degree rotation*/
        assetRotationMap.set(3, (3 * Math.PI) / 2)

        resetGameMapObjects()

        /*Array of Buildings and Streets passed from 2D Planner*/
        const mapElements = computed(() => gameState.gameMapObjects)

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

        /**
         * Calculates the X Coordinate of the game asset (e.g. car / vehicle) which is placed in the current street element
         * @param xCoordCenter x coordinate of the center point of street element, necessary to calculate upper left origin
         * @param xCoordAsset x coordinate of the asset to be placed, between 0 and 1
         */
        function calcAssetCoordinateX(xCoordCenter: number, xCoordAsset: number) {
            let originX = xCoordCenter - fieldSize / 2
            let x = originX + xCoordAsset * fieldSize

            return x
        }

        /**
         * Calculates the Z Coordinate of the game asset (e.g. car / vehicle) which is placed in the current street element
         * @param zCoordCenter z coordinate of the center point of street element, necessary to calculate upper left origin
         * @param yCoordAsset y coordinate of the asset to be placed, between 0 and 1
         */
        function calcAssetCoordinateZ(zCoordCenter: number, yCoordAsset: number) {
            let originZ = zCoordCenter - fieldSize / 2
            let z = originZ + yCoordAsset * fieldSize

            return z
        }

        onMounted(() => {
            console.log(
                `Gamestate ON MOUNTED sizex ${gameState.sizeX}, sizey: ${gameState.sizeY}, fieldSize: ${gameState.fieldSize}`
            )
            updateMapObjsFromGameState()

            renderer.value.onBeforeRender(() => {
                fpsCamera.update()
            })

            initAmbientSound()
        })

        function initAmbientSound() {
            var audio = new Audio("/../../../src/sound/ambient_city_sound.mp3")
            audio.volume = 0.4
            audio.play()
            audio.addEventListener("ended", (e) => {
                audio.play()
            })
        }

        return {
            renderer,
            camera,
            box,
            fpsCamera,
            calcCoordinateX,
            calcCoordinateZ,
            calcAssetCoordinateX,
            calcAssetCoordinateZ,
            buildingIDMap,
            mapElements,
            rotationMap,
            assetRotationMap,
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
        <Scene background="#87CEEB">
            <AmbientLight></AmbientLight>
            <Plane
                :width="gridSizeX"
                :height="gridSizeY"
                :rotation="{ x: -Math.PI / 2 }"
                :position="{ x: 0, y: 0, z: 0 }"
                receive-shadow
            >
                <PhongMaterial color="#999999" :props="{ depthWrite: false }" />
            </Plane>

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
                <!-- places all game assets of the current element-->
                <div v-for="asset in ele.game_assets">
                    <GltfModel
                        v-bind:src="buildingIDMap.get(22)"
                        :position="{
                            x: calcAssetCoordinateX(calcCoordinateX(ele.y), asset.x),
                            y: 0.75,
                            z: calcAssetCoordinateZ(calcCoordinateZ(ele.x), asset.y),
                        }"
                        :scale="{ x: 0.5, y: 0.5, z: 0.5 }"
                        :rotation="{
                            x: 0,
                            y: assetRotationMap.get(asset.rotation),
                            z: 0,
                        }"
                    />
                </div>
            </div>
        </Scene>
    </Renderer>
</template>
