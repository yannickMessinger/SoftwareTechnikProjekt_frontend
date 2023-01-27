<script lang="ts">
import { Box, Camera, Renderer, Scene, GltfModel, AmbientLight, Plane, PhongMaterial } from "troisjs"
import { computed, defineComponent, onMounted, ref, toRaw, watch } from "vue"
import { MovmentInputController } from "../../models/MovementInputController"
import { usePlayerList } from "../../services/usePlayerList"
import useUser from "../../services/UserStore"
import { useGameView } from "../../services/3DGameView/useGameView"
import { useCarMultiplayer } from "../../services/3DGameView/useCarMultiplayer"
import { IPosition } from "../../typings/IPosition"
import { MultiplayerCarlistService } from "../../services/3DGameView/MultiplayerCarlistService"
import { BoundingBoxService } from "../../services/3DGameView/BoundingBoxService"
import { CollisionService } from "../../services/3DGameView/CollisionService"
import { CollisionResetService } from "../../services/3DGameView/CollisionResetService"

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
        const scene = ref()
        const movableObject = new MovmentInputController(box, camera)
        const { gameState, setMapWidthAndMapHeight, resetGameMapObjects, updateMapObjsFromGameState } = useGameView()
        const {
            createMessage,
            deleteMessage,
            updateMessage,
            initCarUpdateWebsocket,
            positionState,
            fillPlayerCarState,
            playerCarState,
        } = useCarMultiplayer()
        const { user, userId, activeLobby, setActiveLobby } = useUser()
        const { playerListState, playerList, fetchPlayerList } = usePlayerList()
        const boundingBoxService = new BoundingBoxService()
        const collisionService = new CollisionService(box)
        const collisionResetService = new CollisionResetService(movableObject)

        let payload: IPosition = { id: 0, x: 0, z: 0, rotation: [0, 0, 0] }
        const scene3DobjectMap = new Map()

        const uid = userId.value
        const rawPlayerList = toRaw(playerList.value)
        const multiplayerCarlistService = new MultiplayerCarlistService(rawPlayerList)
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

        buildingIDMap.set(8, "/../../../src/assets/3D_Models/Streets/streetCrossing.gltf")
        buildingIDMap.set(9, "/../../../src/assets/3D_Models/Railroad/straight_rail.gltf")
        buildingIDMap.set(10, "/../../../src/assets/3D_Models/Railroad/curved_rail.gltf")
        buildingIDMap.set(11, "/../../../src/assets/3D_Models/Railroad/trainstation.gltf")
        buildingIDMap.set(12, "/../../../src/assets/3D_Models/Railroad/road_train_crossing.gltf")

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

        const playerCarList = computed(() => playerCarState.playerCarMap)

        /*Models position are saved from the Backend counting from 0 upwards.
      x:0, z:0 describes the upper left corner. On a 100 x 100 Field the lower right corner would be x:99, z: 99.
      On the 3d Game View the coordinates x:0, z:0 describes the center of our Grid. The upper left corner would be x:-50, z:-50.
      The following two methods calculate the Models position bades on the backend memory structure and adapts it to the frontend structure.*/

        /*Calculates X coordinates position of loaded Model */
        function calcCoordinateX(n: number) {
            let x = gridSizeX * -0.5 + n * fieldSize + fieldSize / 2
            return x
        }

        /*Calculates Z coordinates position of loaded Model */
        function calcCoordinateZ(n: number) {
            let z = gridSizeY * -0.5 + n * fieldSize + fieldSize / 2
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

        /**
         * Fills the payload with userId and movableObject-data for x,z and takes the y element out of quaternion
         * Is used for create and updating messages for the websocket
         */
        function fillPayload() {
            if (userId.value !== undefined) {
                payload.id = userId.value
                payload.rotation = movableObject.getRotation()
                payload.x = movableObject.getPositionX()
                payload.z = movableObject.getPositionZ()
            }
        }

        watch(
            () => gameState.mapObjsFromBackEnd,
            () => fillPlayerCarState()
        )

        onMounted(() => {
            updateMapObjsFromGameState()
            initCarUpdateWebsocket()

            renderer.value.onBeforeRender(() => {
                movableObject.update()
                multiplayerCarlistService.updatePlayerCars(playerCarList, positionState, uid)
                collisionService.updateCarBoundingBox()
                collisionService.checkCollision(
                    boundingBoxService.getBoundingBoxes(),
                    multiplayerCarlistService.getPlayerObjectMap(),
                    collisionResetService
                )
            })

            /**
             * delayed: waiting for socket connection
             */
            setInterval(() => fillPayload(), 25)
            setTimeout(() => setInterval(() => updateMessage(payload), 25), 5000)
            setTimeout(() => createMessage(payload), 5000)
            setTimeout(() => {
                multiplayerCarlistService.loadPlayerObjectMap(scene.value.scene.children)
                boundingBoxService.setObjects(scene)
                collisionResetService.setResetCarPosition(box)
            }, 8000)
        })

        return {
            renderer,
            camera,
            box,
            scene,
            movableObject,
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
            playerCarList,
            uid,
        }
    },
})
</script>

<template>
    <Renderer resize="window" ref="renderer">
        <Camera ref="camera" :position="{ x: 0, y: 0, z: 0 }" :look-at="{ x: 0, y: 0, z: -1 }"> </Camera>
        <Box
            ref="box"
            :position="{ x: playerCarList.get(uid)?.playerCarX, y: 0.75, z: playerCarList.get(uid)?.playerCarZ }"
        ></Box>
        <Scene background="#87CEEB" ref="scene">
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
                    :props="{ name: ele.objectTypeId }"
                />
                <!-- places all game assets of the current element-->
                <div v-for="asset in ele.game_assets">
                    <GltfModel
                        v-if="asset.userId === 0"
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
                        :props="{ name: 22 }"
                    />
                </div>
            </div>
            <!-- creates and sets taxi bassed on playerCarList sets car for each playerId !== userId-->
            <div v-for="player in playerCarList">
                <div v-if="player[1].playerCarId !== uid">
                    <GltfModel
                        v-bind:src="buildingIDMap.get(21)"
                        :position="{
                            x: player[1].playerCarX,
                            y: 0.75,
                            z: player[1].playerCarZ,
                        }"
                        :scale="{ x: 0.5, y: 0.5, z: 0.5 }"
                        :rotation="{
                            x: 0,
                            y: 0, //player[1].playerCarRotation[1],
                            z: 0,
                        }"
                        :props="{ name: `player_${player[1].playerCarId}` }"
                    />
                </div>
            </div>
        </Scene>
    </Renderer>
</template>
