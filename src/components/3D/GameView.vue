<script lang="ts">
import { AmbientLight, Box, Camera, GltfModel, PhongMaterial, Plane, Renderer, Scene } from "troisjs"

import { usePlayerList } from "../../services/User/usePlayerList"
import useUser from "../../services/User/UserStore"

import { useGameView } from "../../services/3DGameView/useGameView"
import { useCarMultiplayer } from "../../services/3DGameView/useCarMultiplayer"
import { useSound } from "../../services/Sound/useSound"
import * as THREE from "three"

import useCrossroadData from "../../services/3DGameView/useCrossroadData"
import { MultiplayerCarlistService } from "../../services/3DGameView/MultiplayerCarlistService"
import { BoundingBoxService } from "../../services/3DGameView/BoundingBoxService"
import { CollisionService } from "../../services/3DGameView/CollisionService"
import { CollisionResetService } from "../../services/3DGameView/CollisionResetService"
import { computed, defineComponent, onBeforeUnmount, onMounted, onUnmounted, ref, toRaw, watch } from "vue"
import { IPosition } from "../../models/3D/IPosition"
import { MovmentInputController } from "../../models/3D/MovementInputController"

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
            positionState,
            initCarUpdateWebsocket,
            createMessage,
            updateMessage,
            fillPlayerCarState,
            playerCarState,
            initNpcSocket,
            fillNpcState,
            updatePosMessage,
            npcState,
        } = useCarMultiplayer()

        const { user, userId, activeLobby } = useUser()
        const { addCrossroad } = useCrossroadData()
        const { playerListState, playerList, fetchPlayerList } = usePlayerList()
        const boundingBoxService = new BoundingBoxService()
        const collisionService = new CollisionService(box)
        const collisionResetService = new CollisionResetService(movableObject)
        const intervalArray: any = []

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
        const multiplayerCarlistService = new MultiplayerCarlistService(rawPlayerList)
        //counter variables for loops to prefill map with dummy data
        const fieldSize = 10
        let mapWidth = 30
        let mapHeight = 20

        /*Defines the Map Size in length by the number ob fields*/
        let gridSizeX = 300
        /*Defines the Map Size in height by the number ob fields*/
        let gridSizeY = 200

        setMapWidthAndMapHeight(mapWidth, mapHeight)

        /*Map of 3d-models and corresponding file paths to load correct gltf model*/
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

        buildingIDMap.set(15, "/../../../src/assets/3D_Models/Building/skyscraper1.gltf")
        buildingIDMap.set(16, "/../../../src/assets/3D_Models/Building/skyscraper2.gltf")
        buildingIDMap.set(17, "/../../../src/assets/3D_Models/Building/skyscraper3.gltf")
        buildingIDMap.set(18, "/../../../src/assets/3D_Models/Building/citybuilding1.gltf")
        buildingIDMap.set(19, "/../../../src/assets/3D_Models/Building/citybuilding2.gltf")
        buildingIDMap.set(20, "/../../../src/assets/3D_Models/Building/citybuilding3.gltf")

        buildingIDMap.set(60, "/../../../src/assets/3D_Models/Enviroment/enviroment_1.gltf")
        buildingIDMap.set(61, "/../../../src/assets/3D_Models/Enviroment/enviroment_2.gltf")
        buildingIDMap.set(62, "/../../../src/assets/3D_Models/Enviroment/enviroment_3.gltf")
        buildingIDMap.set(63, "/../../../src/assets/3D_Models/Enviroment/enviroment_4.gltf")

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

        /**
         * Map that translates rotation values for correct rotation values of MapObjects
         */
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

        /*list of all npc's from backend*/
        const npcEles = computed(() => npcState.npcMap)

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

        /**
         * method was created to be called external out of onBeforeRender
         */
        function moveNpcCars() {
            npcEles.value.forEach((ele) => {
                checkPlayerNPCDistance(ele.positions.npcPosX, ele.positions.npcPosZ, ele.npcId, ele.objectTypeId)
                if (ele.driving) {
                    ele.move()
                }
            })
        }

        function loadSceneChildrenWithKey(sceneObjChildren: Map<any, any>) {
            sceneObjChildren.forEach((ele) => {
                rawPlayerList.forEach((player: any) => {
                    if (ele.name === `player_${player.userId}`) {
                        if (!scene3DobjectMap.get(player.userId) && player.userId !== uid) {
                            scene3DobjectMap.set(player.userId, ele)
                        }
                    }
                })
            })
        }

        function checkPlayerCarDistance(posX: number, posZ: number, carId: number) {
            const MAX_HEARING_DISTANCE = 30
            let distanceX = movableObject.getPositionX() - posX
            let distanceZ = movableObject.getPositionZ() - posZ

            let distance = Math.abs(distanceX) + Math.abs(distanceZ)

            if (distance < MAX_HEARING_DISTANCE) {
                playEngineFromOtherCar(carId, distance)
            } else {
                pauseEngineFromOtherCar(carId)
            }
        }

        /**
         * method for testing to implement simple game logic where npc pedestrians could be picked up by player
         * and be driven to random generated target point on map.
         * @param posX x pos of player car
         * @param posZ z pos of player car
         * @param objectTypeIdNear objectTypeId of the object that is close to player car
         * @param npcId id of near npc
         */
        function checkPassengerPickUp(posX: number, posZ: number, objectTypeIdNear: number, npcId: number) {
            let distanceX = movableObject.getPositionX() - posX
            let distanceZ = movableObject.getPositionZ() - posZ

            let distance = Math.abs(distanceX) + Math.abs(distanceZ)

            if (distance < 5 && objectTypeIdNear >= 50 && objectTypeIdNear < 60) {
                console.log(`obj id: ${objectTypeIdNear}`)
                npcEles.value.get(npcId)!.positions.npcPosX = movableObject.getPositionX()
                npcEles.value.get(npcId)!.positions.npcPosZ = movableObject.getPositionZ()
                console.log(npcEles.value)
            }
        }

        function checkPlayerNPCDistance(posX: number, posZ: number, carId: number, objectTypeId: number) {
            const MAX_HEARING_DISTANCE = 30
            let distanceX = movableObject.getPositionX() - posX
            let distanceZ = movableObject.getPositionZ() - posZ

            let distance = Math.abs(distanceX) + Math.abs(distanceZ)

            if (distance < MAX_HEARING_DISTANCE) {
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
            () => fillNpcState()
        )

        onBeforeUnmount(() => {
            disconnectHornSound()
            stopAmbientSound()
            stopAllEngines()
            stopAllEnginesNPC()
            stopYourEngine()
        })

        onMounted(() => {
            //activates necessary Websocket connections from logic classes.
            updateMapObjsFromGameState()
            initCarUpdateWebsocket()
            initNpcSocket()

            renderer.value.onBeforeRender(() => {
                movableObject.update()
                movePlayerCars()

                /*creates npc movement through calling move method on every npc from npc list*/
                npcEles.value.forEach((ele) => {
                    checkPlayerNPCDistance(ele.positions.npcPosX, ele.positions.npcPosZ, ele.npcId, ele.objectTypeId)
                    if (ele.driving) {
                        ele.move()
                    }
                })

                if (movableObject.hornPlayed) {
                    playHorn()
                }
                if (movableObject.enginePlayed) {
                    playYourEngine()
                }
                multiplayerCarlistService.updatePlayerCars(playerCarList, positionState, uid)
                collisionService.updateCarBoundingBox()
                collisionService.checkCollision(
                    boundingBoxService.getBoundingBoxes(),
                    multiplayerCarlistService.getPlayerObjectMap(),
                    collisionResetService
                )
            })

            /**
             *Method that checks every 500ms if npc element needs update of its map elements by checking,
             *if npc element has reached the limit of its internal current map object.
             *triggers service method if necessary.
             */
            intervalArray.push(
                setInterval(() => {
                    npcEles.value.forEach((ele) => {
                        if (ele.reachedMapEleLimit()) {
                            updatePosMessage(ele.npcId)
                        }
                    })
                }, 500)
            )

            initAmbientSound()

            /**
             * delayed: waiting for socket connection
             */
            intervalArray.push(setInterval(() => fillPayload(), 25))
            setTimeout(() => intervalArray.push(setInterval(() => updateMessage(payload), 25)), 2000)
            setTimeout(() => createMessage(payload), 2000)
            setTimeout(() => {
                multiplayerCarlistService.loadPlayerObjectMap(scene.value.scene.children)
                boundingBoxService.setObjects(scene)
                collisionResetService.setResetCarPosition(box)
            }, 3000)
            setTimeout(() => loadSceneChildrenWithKey(scene.value.scene.children), 3000)
        })

        onUnmounted(() => {
            intervalArray.forEach((interval: any) => clearInterval(interval))
        })

        return {
            npcEles,
            renderer,
            camera,
            box,
            scene,
            movableObject,
            addCrossroad,
            buildingIDMap,
            mapElements,
            rotationMap,
            gridSizeX,
            gridSizeY,
            fieldSize,
            playerCarList,
            uid,
            randomNumber,
            intervalArray,
        }
    },
})
</script>

<template>
    <Renderer resize="window" ref="renderer">
        <Camera ref="camera" :position="{ x: 0, y: 0, z: 0 }" :look-at="{ x: 0, y: 0, z: -1 }" :far="80"> </Camera>
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
                            ? addCrossroad(4, scene, ele.centerX3d!, ele.centerZ3d!, rotationMap)
                            : null
                    "
                />
            </div>
            <!-- places all game assets of asset list-->
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
                            y: 0,
                            z: 0,
                        }"
                        :props="{ name: `player_${player[1].playerCarId}` }"
                    />
                </div>
            </div>
        </Scene>
    </Renderer>
</template>
