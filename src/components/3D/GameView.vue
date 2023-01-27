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
    toRaw,
    getCurrentInstance,
    watch,
} from "vue"
import { FirstPersonCamera } from "../../models/FirstPersonCamera"
import { MovmentInputController } from "../../models/MovementInputController"
import { usePlayerList } from "../../services/usePlayerList"
import useUser from "../../services/UserStore"
import { CreatePlayerCars } from "../../models/CreatePlayerCars"
import { useGameView } from "../../services/3DGameView/useGameView"
import { useCarMultiplayer } from "../../services/3DGameView/useCarMultiplayer"
import { IPosition } from "../../typings/IPosition"
import { useSound } from "../../services/useSound"
import { on } from "events"
import * as THREE from "three"
import { useCarMap } from "../../services/3DGameView/useCarMap"
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
        // allows the manipulation of object through key input and sets camera as first person
        const movableObject = new MovmentInputController(box, camera)
        //const fpsCamera = new FirstPersonCamera(camera, box)

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
        } = useCarMultiplayer()

        const { user, userId, activeLobby, setActiveLobby } = useUser()
        const { playerListState, playerList, fetchPlayerList } = usePlayerList()
        const { loadTrafficLight } = useCrossroadData()

        let payload: IPosition = { id: 0, x: 0, z: 0, rotation: [0, 0, 0] }

        const {
            playHorn,
            playEngine,
            stopEngine,
            playEngineFromOtherCar,
            pauseEngineFromOtherCar,
            connectSound,
            initAmbientSound,
            stopAmbientSound,
            disconnectSound,
            stopAllEngines,
            pauseEngineFromOtherCarNPC,
            playEngineFromOtherCarNPC,
            stopAllEnginesNPC,
        } = useSound(activeLobby.value.lobbyId, payload)
        connectSound()

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

        buildingIDMap.set(7, "/../../../src/assets/3D_Models/Vehicles/car_1.gltf")
        buildingIDMap.set(23, "/../../../src/assets/3D_Models/TrafficLight/Traffic_Light.gltf")
        buildingIDMap.set(14, "/../../../src/assets/3D_Models/Vehicles/thomas2.gltf")

        buildingIDMap.set(30, "/../../../src/assets/3D_Models/Vehicles/car_blue.gltf")
        buildingIDMap.set(31, "/../../../src/assets/3D_Models/Vehicles/car_green.gltf")
        buildingIDMap.set(32, "/../../../src/assets/3D_Models/Vehicles/car_orange.gltf")
        buildingIDMap.set(33, "/../../../src/assets/3D_Models/Vehicles/car_white.gltf")

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

        /*Array of Buildings and Streets passed from 2D Planner*/
        const mapElements = computed(() => gameState.gameMapObjects)
        const playerCarList = computed(() => playerCarState.playerCarMap)
        const npcEles = computed(() => npcCarState.npcCarMap)

        /*Models position are saved from the Backend counting from 0 upwards.
      x:0, z:0 describes the upper left corner. On a 100 x 100 Field the lower right corner would be x:99, z: 99.
      On the 3d Game View the coordinates x:0, z:0 describes the center of our Grid. The upper left corner would be x:-50, z:-50.
      The following two methods calculate the Models position bades on the backend memory structure and adapts it to the frontend structure.*/

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
                        //let rotationValue = positionEle.rotation * Math.PI
                        ele.playerCarX = positionEle.x
                        ele.playerCarZ = positionEle.z
                        ele.playerCarRotation
                        //scene3DobjectMap.get(positionEle.id).setRotationFromEuler(new THREE.Euler( positionEle.rotation ))
                        let x = scene3DobjectMap.get(positionEle.id)
                        //x.rotation = positionEle.rotation
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
                            //scene3DobjectMap.set(positionEle.id,x)
                            //console.log("ele.playerCarRotation",ele.playerCarRotation)

                            /*console.log(
                                "positionEle.rotation",
                                new THREE.Euler(
                                    positionEle.rotation._x,
                                    positionEle.rotation._y,
                                    positionEle.rotation._z,
                                    positionEle.rotation.order
                                )
                            )
                            console.log("x", x)*/
                        }
                    }
                })
            })
        }

        function loadSceneChildrenWithKey(sceneObjChildren: Map<any, any>) {
            console.log("anfangfunction", scene3DobjectMap)
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

            //console.log("X" + distanceX)
            //console.log("Y:" + distanceZ)
            let distance = Math.abs(distanceX) + Math.abs(distanceZ)

            if (distance < 20) {
                playEngineFromOtherCar(carId, distance)
            } else {
                pauseEngineFromOtherCar(carId)
            }
        }

        function checkPlayerCarDistanceNPC(posX: number, posZ: number, carId: number) {
            let distanceX = movableObject.getPositionX() - posX
            let distanceZ = movableObject.getPositionZ() - posZ

            // console.log("X" + posX)
            //console.log("Y:" + posZ)
            let distance = Math.abs(distanceX) + Math.abs(distanceZ)

            if (distance < 20) {
                playEngineFromOtherCarNPC(carId, distance)
            } else {
                pauseEngineFromOtherCarNPC(carId)
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
            disconnectSound()
            stopAmbientSound()
            stopAllEngines()
            stopAllEnginesNPC()
            stopEngine()
        })

        onMounted(() => {
            updateMapObjsFromGameState()
            initCarUpdateWebsocket()
            initNpcSocket()

            renderer.value.onBeforeRender(() => {
                movableObject.update()
                movePlayerCars()
                npcEles.value.forEach((ele) => {
                    checkPlayerCarDistanceNPC(ele.positions.npcPosX, ele.positions.npcPosZ, ele.npcId)
                    if (ele.driving) {
                        ele.drive()
                    }
                })
                if (movableObject.hornPlayed) {
                    playHorn()
                }
                if (movableObject.enginePlayed) {
                    playEngine()
                }
            })

            setInterval(() => {
                npcEles.value.forEach((ele) => {
                    console.log(ele.reachedMapEleLimit())
                    if (ele.reachedMapEleLimit()) {
                        console.log(`ele mit ${ele.npcId} braucht POS Update!`)
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
            setTimeout(() => console.log("scene:", scene.value.scene.children), 7500)
            setTimeout(() => loadSceneChildrenWithKey(scene.value.scene.children), 8000)
            setTimeout(() => console.log("map:", scene3DobjectMap), 7500)
            setInterval(() => {
                scene3DobjectMap.forEach((player) => {
                    //console.log(player.setRotationFromEuler(new THREE.Vector3(0, 1, 0),10))
                })
            })

            /*
            setInterval(() => {
                console.log(sceneRef.value.scene)
            },1000)*/
        })

        return {
            npcEles,
            renderer,
            camera,
            box,
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
