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
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRaw, watch } from "vue"

import { MovmentInputController } from "../../models/MovementInputController"
import { usePlayerList } from "../../services/usePlayerList"
import useUser from "../../services/UserStore"

import { useGameView } from "../../services/3DGameView/useGameView"
import { useCarMultiplayer } from "../../services/3DGameView/useCarMultiplayer"
import { IPosition } from "../../typings/IPosition"
import { useSound } from "../../services/useSound"
import { on } from "events"
import * as THREE from "three"

import useCrossroadData from "../../services/3DGameView/useCrossroadData"

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
        const isHost = ref(false)

        const movableObject = new MovmentInputController(box, camera)

        const { gameState, setMapWidthAndMapHeight, resetGameMapObjects, updateMapObjsFromGameState, randomNumber } =
            useGameView()

        const {
            createMessage,
            updateMessage,
            initCarUpdateWebsocket,
            positionState,
            fillPlayerCarState,
            playerCarState,
            initNpcSocket,
            updatePosMessage,
            npcCarState,
            fillNpcCars,
            setClientPosMessage,
            initNpcPositionSocket,
        } = useCarMultiplayer()

        const { user, userId, activeLobby } = useUser()
        const { playerList } = usePlayerList()
        const { loadTrafficLight } = useCrossroadData()

        if (user.userId === activeLobby.value.hostId) {
            console.log("User ist Host!!!")
            isHost.value = true
        } else {
            console.log("___User ist KEIN host!")
        }

        let payload: IPosition = { id: 0, x: 0, z: 0, rotation: [0, 0, 0] }

        const {
            playHorn,
            playYourEngine,
            stopYourEngine,
            playEngineFromOtherCar,
            pauseEngineFromOtherCar,
            connectHornSound,
            initAmbientSound,
            stopAmbientSound,
            disconnectHornSound,
            stopAllEngines,
            playEngineFromNPC,
            pauseEngineFromNPC,
            stopAllEnginesNPC,
        } = useSound(activeLobby.value.lobbyId, payload)

        const scene3DobjectMap = new Map()

        const uid = userId.value
        const rawPlayerList = toRaw(playerList.value)
        //counter variables for loops to prefill map with dummy data
        const fieldSize = 10
        let mapWidth = 30
        let mapHeight = 20

        /*Defines the Grid Size in length by the number ob fields*/
        let gridSizeX = 300
        /*Defines the Grid Size in height by the number ob fields*/
        let gridSizeY = 200

        setMapWidthAndMapHeight(mapWidth, mapHeight)

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

        buildingIDMap.set(7, "/../../../src/assets/3D_Models/Vehicles/car_1.gltf")
        buildingIDMap.set(23, "/../../../src/assets/3D_Models/TrafficLight/Traffic_Light.gltf")
        buildingIDMap.set(14, "/../../../src/assets/3D_Models/Vehicles/thomas2.gltf")

        buildingIDMap.set(30, "/../../../src/assets/3D_Models/Vehicles/car_blue.gltf")
        buildingIDMap.set(31, "/../../../src/assets/3D_Models/Vehicles/car_green.gltf")
        buildingIDMap.set(32, "/../../../src/assets/3D_Models/Vehicles/car_orange.gltf")
        buildingIDMap.set(33, "/../../../src/assets/3D_Models/Vehicles/car_white.gltf")

        buildingIDMap.set(50, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBlondeBlack.gltf")
        buildingIDMap.set(51, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBlondeBlue.gltf")
        buildingIDMap.set(52, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBrowneBlue.gltf")
        buildingIDMap.set(53, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBrowneRed.gltf")
        buildingIDMap.set(54, "/../../../src/assets/3D_Models/Pedestrians/pedestrianBrownPink.gltf")
        buildingIDMap.set(55, "/../../../src/assets/3D_Models/Pedestrians/pedestrianOrangeGreen.gltf")
        buildingIDMap.set(56, "/../../../src/assets/3D_Models/Pedestrians/pedestrianOrangeWhite.gltf")
        buildingIDMap.set(57, "/../../../src/assets/3D_Models/Pedestrians/pedestrianRed.gltf")
        buildingIDMap.set(58, "/../../../src/assets/3D_Models/Pedestrians/PoliceOfficer.gltf")
        buildingIDMap.set(59, "/../../../src/assets/3D_Models/Pedestrians/Firefighter.gltf")

        const rotationMap = new Map()

        rotationMap.set(0, 0)

        rotationMap.set(1, (3 * Math.PI) / 2)

        rotationMap.set(2, Math.PI)

        rotationMap.set(3, Math.PI / 2)

        resetGameMapObjects()

        connectHornSound()

        /*Array of Buildings and Streets passed from 2D Planner*/
        const mapElements = computed(() => gameState.gameMapObjects)
        const playerCarList = computed(() => playerCarState.playerCarMap)
        const npcEles = computed(() => npcCarState.npcCarMap)

        /*Models position are saved from the Backend counting from 0 upwards.
      x:0, z:0 describes the upper left corner. On a 100 x 100 Field the lower right corner would be x:99, z: 99.
      On the 3d Game View the coordinates x:0, z:0 describes the center of our Grid. The upper left corner would be x:-50, z:-50.
      The following two methods calculate the Models position bades on the backend memory structure and adapts it to the frontend structure.*/

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

        /**
         * Used for moving other Playercars according to positionState Values which are set/changed in useCarMultiplayer
         * iterates through ele of Map<playerid,car>  and list of Iposition in positionState for value
         *
         */
        function movePlayerCars() {
            playerCarList.value.forEach((ele) => {
                positionState.mapObjects.forEach((positionEle) => {
                    if (ele.playerCarId !== uid && positionEle.id === ele.playerCarId) {
                        ele.playerCarX = positionEle.x
                        ele.playerCarZ = positionEle.z
                        ele.playerCarRotation

                        let x = scene3DobjectMap.get(positionEle.id)

                        checkPlayerCarDistance(ele.playerCarX, ele.playerCarZ, ele.playerCarId)
                        if (x != undefined) {
                            x.setRotationFromEuler(
                                new THREE.Euler(
                                    positionEle.rotation._x,
                                    positionEle.rotation._y,
                                    positionEle.rotation._z,
                                    positionEle.rotation.order
                                )
                            )
                        }
                    }
                })
            })
        }

        function loadSceneChildrenWithKey(sceneObjChildren: Map<any, any>) {
            // console.log("anfangfunction", scene3DobjectMap)
            sceneObjChildren.forEach((ele) => {
                rawPlayerList.forEach((player) => {
                    if (ele.name === `player_${player.userId}`) {
                        if (!scene3DobjectMap.get(player.userId) && player.userId !== uid) {
                            scene3DobjectMap.set(player.userId, ele)
                        }
                    }
                })
            })
        }

        function checkPlayerCarDistance(posX: number, posZ: number, carId: number) {
            let distanceX = movableObject.getPositionX() - posX
            let distanceZ = movableObject.getPositionZ() - posZ

            let distance = Math.abs(distanceX) + Math.abs(distanceZ)

            if (distance < 30) {
                playEngineFromOtherCar(carId, distance)
            } else {
                pauseEngineFromOtherCar(carId)
            }
        }

        function checkPlayerNPCDistance(posX: number, posZ: number, carId: number, objectTypeId: number) {
            let distanceX = movableObject.getPositionX() - posX
            let distanceZ = movableObject.getPositionZ() - posZ

            let distance = Math.abs(distanceX) + Math.abs(distanceZ)

            if (distance < 30) {
                playEngineFromNPC(carId, distance, objectTypeId)
            } else {
                pauseEngineFromNPC(carId)
            }
        }

        watch(
            () => gameState.mapObjsFromBackEnd,
            () => fillPlayerCarState()
        )

        watch(
            () => gameState.mapObjsFromBackEnd,
            () => fillNpcCars()
        )

        onBeforeUnmount(() => {
            disconnectHornSound()
            stopAmbientSound()
            stopAllEngines()
            stopAllEnginesNPC()
            stopYourEngine()
        })

        onMounted(() => {
            updateMapObjsFromGameState()
            initCarUpdateWebsocket()
            initNpcSocket()
            //initNpcPositionSocket()

            renderer.value.onBeforeRender(() => {
                movableObject.update()
                movePlayerCars()

                npcEles.value.forEach((ele) => {
                    checkPlayerNPCDistance(ele.positions.npcPosX, ele.positions.npcPosZ, ele.npcId, ele.objectTypeId)
                    if (ele.driving) {
                        ele.move()
                    }
                })

                /*
                if(isHost){
                    setInterval(() =>{
                        npcEles.value.forEach((ele) => {
                            checkPlayerCarDistanceNPC(ele.positions.npcPosX, ele.positions.npcPosZ, ele.npcId)
                            if (ele.driving) {
                                ele.move()
                                setClientPosMessage({npcId:ele.npcId, npcPosX:ele.positions.npcPosX, npcPosZ:ele.positions.npcPosZ, npcRotation:ele.positions.npcRotation})
                              
                            }
                        })

                    },1000)

                }*/

                if (movableObject.hornPlayed) {
                    playHorn()
                }
                if (movableObject.enginePlayed) {
                    playYourEngine()
                }
            })

            setInterval(() => {
                npcEles.value.forEach((ele) => {
                    if (ele.reachedMapEleLimit()) {
                        updatePosMessage(ele.npcId)
                    }
                })
            }, 500)

            initAmbientSound()

            /**
             * delayed: waiting for socket connection
             */
            setInterval(() => fillPayload(), 25)
            setTimeout(() => setInterval(() => updateMessage(payload), 25), 5000)
            setTimeout(() => createMessage(payload), 5000)
            //setTimeout(() => console.log("scene:", scene.value.scene.children), 7500)
            setTimeout(() => loadSceneChildrenWithKey(scene.value.scene.children), 8000)
            //setTimeout(() => console.log("map:", scene3DobjectMap), 7500)
        })

        return {
            npcEles,
            renderer,
            camera,
            box,
            calcAssetCoordinateX,
            calcAssetCoordinateZ,
            scene,
            movableObject,
            loadTrafficLight,
            buildingIDMap,
            mapElements,
            rotationMap,
            gridSizeX,
            gridSizeY,
            fieldSize,
            playerCarList,
            uid,
            randomNumber,
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

            <!-- All elements placed in the editor are read from the list and placed in the scene-->
            <div v-for="ele in mapElements">
                <GltfModel
                    v-bind:src="buildingIDMap.get(ele.objectTypeId)"
                    :position="{
                        x: ele.centerX3d,
                        y: 0,
                        z: ele.centerZ3d,
                    }"
                    :scale="{ x: 0.5, y: 0.5, z: 0.5 }"
                    :rotation="{ x: 0, y: rotationMap.get(ele.rotation), z: 0 }"
                    :props="{ name: ele.objectId }"
                    v-on:load="
                        ele.objectTypeId === 2
                            ? loadTrafficLight(ele, scene.scene, ele.centerX3d!, ele.centerZ3d!, rotationMap)
                            : null
                    "
                />
            </div>
            <!-- places all game assets of the current element-->
            <!--randomNumber(randomCar)-->
            <div v-for="asset in npcEles">
                <GltfModel
                    v-bind:src="buildingIDMap.get(asset[1].objectTypeId)"
                    :position="{
                        x: asset[1].positions.npcPosX,
                        y: 0,
                        z: asset[1].positions.npcPosZ,
                    }"
                    :scale="{ x: 0.5, y: 0.5, z: 0.5 }"
                    :rotation="{
                        x: 0,
                        y: asset[1].viewRotation,
                        z: 0,
                    }"
                    :props="{ name: 22 }"
                />
            </div>
            <!-- creates and sets taxi bassed on playerCarList sets car for each playerId !== userId-->
            <div v-for="player in playerCarList">
                <div v-if="player[1].playerCarId !== uid">
                    <GltfModel
                        v-bind:src="buildingIDMap.get(21)"
                        :position="{
                            x: player[1].playerCarX,
                            y: 0,
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
