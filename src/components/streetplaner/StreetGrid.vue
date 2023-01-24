<script setup lang="ts">
import { computed } from "@vue/reactivity"
import { ref, reactive, watch, onMounted } from "vue"
import type { IGridElement } from "../../services/streetplaner/IGridElement"
import useEventBus from "../../services/eventBus"
import ToolEnum from "../../services/streetplaner/ToolEnum"
import { useGridSize } from "../../services/useGridSize"

import { useBlockList, updateBlockList } from "../../services/streetplaner/useBlockList"
import { useStreetGridList, updateStreetGridList, postStreetGrid } from "../../services/streetplaner/useStreetGridList"
import { IBlockElement } from "../../services/streetplaner/IBlockElement"
import { IMapObject } from "../../services/streetplaner/IMapObject"
import { StreetGridDTO } from "../../services/streetplaner/StreetGridDTO"
import useUser from "../../services/UserStore"
import { useEditor } from "../../services/Editor/useEditor"
import { useGameView } from "../../services/3DGameView/useGameView"
import { IGameAsset2D } from "../../services/streetplaner/IGameAsset2D"
const { bus } = useEventBus()
const { setGameStateSizes, setGameStateMapId } = useGameView()
const { blockListState, updateBlockList } = useBlockList()

var gridSizeX = 20
var gridSizeY = 30
const toolState = reactive({
    tool: ToolEnum.EMPTY,
    block: { objectTypeId: -1, groupId: -1, rotation: 0, texture: "" },
})
const lobbyState = useUser().activeLobby
const { gridSize } = useGridSize()

const {
    editorState,
    createMessage,
    deleteMessage,
    updateMessage,
    resetMessage,
    updateMap,
    receiveEditorUpdates,
    updateMapId,
} = useEditor(lobbyState.value.mapId)

watch(
    () => bus.value.get("tool-select-event"),
    (val) => {
        toolState.tool = val[0]
    }
)
watch(
    () => bus.value.get("block-select-event"),
    (val) => {
        toolState.block = val[0]
    }
)
watch(
    () => bus.value.get("grid-reset-event"),
    (val) => {
        if (val) {
            resetMessage()
        }
    }
)
watch(
    () => bus.value.get("grid-save-event"),
    () => {
        saveStreetGrid()
    }
)
watch(
    () => bus.value.get("random-asset-event"),
    (val) => {
        //Todo: liste leeren
        placeAssetOnRandomElement(val[0].car, 7)
        placeRandomPedestrians(val[0].pedestrian)
    }
)

// create and initialize streetGrid
const streetGrid: IGridElement[][] = reactive(
    Array(gridSizeX)
        .fill([])
        .map(() => Array(gridSizeY).fill(null))
)
fillGridEmpty()

// initialize gridSize
//const gridSize = ref(40)
// initialize gridSizePx used in css
const gridSizePx = computed(() => gridSize.size.toString() + "px")
const assetSize = computed(() => gridSize.size / 4)
const assetSizePx = computed(() => assetSize.value.toString() + "px")
// declare blockList
var blockList: Array<IBlockElement>
watch(
    () => editorState.mapObjects,
    () => loadStreetGrid(editorState)
)
watch(
    () => blockListState.list,
    () => (blockList = blockListState.list)
)

onMounted(() => {
    // get blockList from backend
    // get streetgrid from backend via mapID

    setGameStateSizes(gridSizeY, gridSizeX, gridSize.size)

    updateBlockList()
    receiveEditorUpdates()
    updateMapId(lobbyState.value.mapId)
    setGameStateMapId(lobbyState.value.mapId)
    updateMap()
})

function placeAssetOnRandomElement(amountAssets: number, assetObjectId: number) {
    let counter = 0
    let errorCounter = 0
    let changedElements: Array<IMapObject> = []
    while (counter !== amountAssets) {
        let randomIndex = Math.floor(Math.random() * editorState.mapObjects.length)
        let randomElement = editorState.mapObjects[randomIndex]
        // try to place asset on random element
        if (placeRandomAssetOnElement(randomElement, assetObjectId)) {
            if (changedElements.includes(randomElement)) {
                delete changedElements[changedElements.indexOf(randomElement)]
            }
            changedElements.push(editorState.mapObjects[randomIndex])
            counter++
        } else {
            errorCounter++
        }
        // if asset wasn't placeable on the last 3 elements, try to place it on any element
        if (errorCounter >= 3) {
            for (let ele of editorState.mapObjects) {
                // if asset is placeable reset errorCounter and continue
                if (placeRandomAssetOnElement(ele, assetObjectId)) {
                    if (changedElements.includes(randomElement)) {
                        delete changedElements[changedElements.indexOf(randomElement)]
                    }
                    changedElements.push(editorState.mapObjects[randomIndex])
                    counter++
                    errorCounter = 0
                }
            }
            // if asset isn't placeable, then there are no more spawnpoints available
            if (errorCounter > 0) {
                break
            }
        }
    }
    return changedElements;
}

function placeRandomPedestrians(amount: number) {
    let counter = 0;
    const pedestrianAmount = 10;
    const firstPedestrianId = 8
    while(counter < amount) {
        let randomPedestrianObjectTypeId = Math.floor(Math.random() * pedestrianAmount + firstPedestrianId) // different objectTypeIds due to different pedestrian models
        placeAssetOnRandomElement(1, randomPedestrianObjectTypeId);
        counter++;
    }
}

function getRandomSpawnsCar(element: IMapObject) {
    let randomPosElements: Array<{ x: number; y: number; rotation: number }> = []

    if (element) {
        if (element.objectTypeId === 0) {
            // element = straight
            if (element.rotation % 2 === 0) {
                randomPosElements.push(
                    ...[
                        { x: 0.37, y: 0.25, rotation: 2 },
                        { x: 0.37, y: 0.75, rotation: 2 },
                        { x: 0.62, y: 0.75, rotation: 0 },
                        { x: 0.62, y: 0.25, rotation: 0 },
                    ]
                )
            } else if (element.rotation % 2 === 1) {
                randomPosElements.push(
                    ...[
                        { x: 0.25, y: 0.37, rotation: 3 },
                        { x: 0.75, y: 0.37, rotation: 3 },
                        { x: 0.75, y: 0.62, rotation: 1 },
                        { x: 0.25, y: 0.62, rotation: 1 },
                    ]
                )
            }
        } else if (element.objectTypeId === 1) {
            // element = curve
            if (element.rotation === 0) {
                randomPosElements.push(
                    ...[
                        { x: 0.38, y: 0.88, rotation: 2 },
                        { x: 0.64, y: 0.88, rotation: 0 },
                        { x: 0.88, y: 0.38, rotation: 3 },
                        { x: 0.88, y: 0.64, rotation: 1 },
                    ]
                )
            } else if (element.rotation === 1) {
                randomPosElements.push(
                    ...[
                        { x: 0.36, y: 0.88, rotation: 2 },
                        { x: 0.62, y: 0.88, rotation: 0 },
                        { x: 0.12, y: 0.38, rotation: 3 },
                        { x: 0.12, y: 0.65, rotation: 1 },
                    ]
                )
            } else if (element.rotation === 2) {
                randomPosElements.push(
                    ...[
                        { x: 0.12, y: 0.34, rotation: 3 },
                        { x: 0.12, y: 0.62, rotation: 1 },
                        { x: 0.62, y: 0.12, rotation: 0 },
                        { x: 0.34, y: 0.12, rotation: 2 },
                    ]
                )
            } else if (element.rotation === 3) {
                randomPosElements.push(
                    ...[
                        { x: 0.64, y: 0.12, rotation: 0 },
                        { x: 0.38, y: 0.12, rotation: 2 },
                        { x: 0.88, y: 0.34, rotation: 3 },
                        { x: 0.88, y: 0.64, rotation: 1 },
                    ]
                )
            }
        } else if (element.objectTypeId === 2) {
            // element = intersection
            randomPosElements.push(
                ...[
                    { x: 0.37, y: 0.12, rotation: 2 },
                    { x: 0.37, y: 0.88, rotation: 2 },
                    { x: 0.62, y: 0.88, rotation: 0 },
                    { x: 0.62, y: 0.12, rotation: 0 },
                    { x: 0.12, y: 0.37, rotation: 3 },
                    { x: 0.88, y: 0.37, rotation: 3 },
                    { x: 0.88, y: 0.62, rotation: 1 },
                    { x: 0.12, y: 0.62, rotation: 1 },
                ]
            )
        }
    }
    return randomPosElements
}

function getRandomSpawnsPedestrian(element: IMapObject) {
    let randomPosElements: Array<{ x: number; y: number; rotation: number }> = []
    switch (element.objectTypeId) {
        // case: straight street, intended to be walking on the right side of a sidewalk
        case 0:
            if (element.rotation % 2 === 0) {
                for (let i = 0.125; i < 1; i += 0.125) {
                    // rotation 0
                    let pedRotation = 0
                    randomPosElements.push(
                        ...[
                            { x: 0.2, y: i, rotation: pedRotation },
                            { x: 0.9, y: i, rotation: pedRotation },
                        ]
                    )
                    // rotation 2
                    pedRotation = 2
                    randomPosElements.push(
                        ...[
                            { x: 0.1, y: i, rotation: pedRotation },
                            { x: 0.8, y: i, rotation: pedRotation },
                        ]
                    )
                }
            } else if (element.rotation % 2 === 1) {
                for (let i = 0.125; i < 1; i += 0.125) {
                    // rotation 1
                    let pedRotation = 1
                    randomPosElements.push(
                        ...[
                            { x: i, y: 0.2, rotation: pedRotation },
                            { x: i, y: 0.9, rotation: pedRotation },
                        ]
                    )
                    // rotation 3
                    pedRotation = 3
                    randomPosElements.push(
                        ...[
                            { x: i, y: 0.1, rotation: pedRotation },
                            { x: i, y: 0.8, rotation: pedRotation },
                        ]
                    )
                }
            }
            break
        // case: curve
        case 1:
            if (element.rotation % 4 === 0) {
                randomPosElements.push(...[{ x: 0.9, y: 0.9, rotation: 1 }])
            } else if (element.rotation % 4 === 1) {
                randomPosElements.push(...[{ x: 0.1, y: 0.9, rotation: 2 }])
            } else if (element.rotation % 4 === 2) {
                randomPosElements.push(...[{ x: 0.1, y: 0.1, rotation: 3 }])
            } else if (element.rotation % 4 === 3) {
                randomPosElements.push(...[{ x: 0.9, y: 0.1, rotation: 0 }])
            }
            break
        // case: intersection
        case 2:
            randomPosElements.push(
                ...[
                    { x: 0.9, y: 0.1, rotation: 0 },
                    { x: 0.9, y: 0.9, rotation: 1 },
                    { x: 0.1, y: 0.9, rotation: 2 },
                    { x: 0.1, y: 0.1, rotation: 3 },

                    { x: 0.2, y: 0.2, rotation: 0 },
                    { x: 0.8, y: 0.2, rotation: 1 },
                    { x: 0.8, y: 0.8, rotation: 2 },
                    { x: 0.2, y: 0.8, rotation: 3 },
                ]
            )
            break
    }

    return randomPosElements
}

// tries to place random car on an elment, returns true if car was placed, else false
function placeRandomAssetOnElement(element: IMapObject, assetObjectTypeId: number): boolean {
    let randomPosElements: Array<{ x: number; y: number; rotation: number }> = []
    console.log("RANDOM EVENT ASSET: ", assetObjectTypeId, element)
    // if assetId = 7, then asset = car
    if (assetObjectTypeId === 7) {
        randomPosElements = getRandomSpawnsCar(element)
    }
    // if (7 < assetId < 18), then asset = pedestrian
    else if (assetObjectTypeId > 7 && assetObjectTypeId < 18) {
        randomPosElements = getRandomSpawnsPedestrian(element)
    }

    // check if the max capacity is reached
    if (element.game_assets.length === randomPosElements.length) {
        return false
    }

    // pick random spawnpoint
    let randomPos = Math.floor(Math.random() * randomPosElements.length)
    // check if spawnpoint is taken
    if (checkAssetPlacedNearElement(element.game_assets, randomPosElements[randomPos])) {
        randomPos = 0
        // spawnpoint is taken so try to place car on the other spawnpoints
        while (randomPos < randomPosElements.length) {
            if (checkAssetPlacedNearElement(element.game_assets, randomPosElements[randomPos])) {
                randomPos++
            } else {
                streetGrid[element.x][element.y].game_assets.push({
                    objectTypeId: assetObjectTypeId,
                    x: randomPosElements[randomPos].x,
                    y: randomPosElements[randomPos].y,
                    rotation: randomPosElements[randomPos].rotation,
                    texture: blockList[assetObjectTypeId].texture,
                })
                return true
            }
        }
    } else {
        // spawnpoint is free, so place car there
        console.log("TEXTURE ELEMENT: ", blockList, assetObjectTypeId);
        streetGrid[element.x][element.y].game_assets.push({
            objectTypeId: assetObjectTypeId,
            x: randomPosElements[randomPos].x,
            y: randomPosElements[randomPos].y,
            rotation: randomPosElements[randomPos].rotation,
            texture: blockList[assetObjectTypeId].texture,
        })
        return true
    }

    return false
}

// checks if car is placed on or too near to other asset
function checkAssetPlacedNearElement(
    game_assets: IGameAsset2D[],
    pos: { x: number; y: number; rotation: number }
): boolean {
    let deltaX: number
    let deltaY: number
    // set distance to other car/asset via rotation
    if (pos.rotation % 2 == 1) {
        deltaX = 0.21
        deltaY = 0.1
    } else {
        deltaY = 0.21
        deltaX = 0.1
    }
    // check if asset would be placed inside the perimeter
    if (
        game_assets.filter(
            (obj: IGameAsset2D) =>
                obj.x >= pos.x - deltaX && obj.x <= pos.x + deltaX && obj.y >= pos.y - deltaY && obj.y <= pos.y + deltaY
        ).length > 0
    ) {
        return true
    } else {
        return false
    }
}

// onClick handles click on specific cell
function onClick(cell: any, e: any) {
    let currCellContent = streetGrid[cell.posX][cell.posY]
    let payload: IMapObject
    if (toolState.tool === ToolEnum.CREATE && toolState.block.objectTypeId !== -1) {
        // if toolState block = asset
        if (toolState.block.groupId === 2) {
            if (e.target.classList.contains("asset-img")) {
                return
            }
            // only place asset if it's placed on a road
            if (currCellContent.groupId === 0) {
                let rect = e.target.getBoundingClientRect()
                let x = (e.clientX - rect.left) / gridSize.size
                let y = (e.clientY - rect.top) / gridSize.size
                if (
                    checkAssetPlacedNearElement(currCellContent.game_assets, {
                        x: x,
                        y: y,
                        rotation: toolState.block.rotation,
                    })
                ) {
                    return
                }
                streetGrid[cell.posX][cell.posY].game_assets.push({
                    objectTypeId: toolState.block.objectTypeId,
                    x: x,
                    y: y,
                    rotation: toolState.block.rotation,
                    texture: toolState.block.texture,
                })
                payload = {
                    objectTypeId: currCellContent.objectTypeId,
                    x: cell.posX,
                    y: cell.posY,
                    rotation: currCellContent.rotation,
                    game_assets: streetGrid[cell.posX][cell.posY].game_assets,
                }
                updateMessage(payload)
            }
        } else {
            streetGrid[cell.posX][cell.posY].objectTypeId = toolState.block.objectTypeId
            streetGrid[cell.posX][cell.posY].rotation = toolState.block.rotation
            streetGrid[cell.posX][cell.posY].texture = toolState.block.texture
            payload = {
                objectTypeId: toolState.block.objectTypeId,
                x: cell.posX,
                y: cell.posY,
                rotation: toolState.block.rotation,
                game_assets: streetGrid[cell.posX][cell.posY].game_assets,
            }
            createMessage(payload)
        }
    }
    if (toolState.tool == ToolEnum.ROTATE && streetGrid[cell.posX][cell.posY].objectTypeId !== -1) {
        streetGrid[cell.posX][cell.posY].rotation = (streetGrid[cell.posX][cell.posY].rotation + 1) % 4
        payload = {
            objectTypeId: streetGrid[cell.posX][cell.posY].objectTypeId,
            x: cell.posX,
            y: cell.posY,
            rotation: streetGrid[cell.posX][cell.posY].rotation,
            game_assets: streetGrid[cell.posX][cell.posY].game_assets,
        }
        updateMessage(payload)
    }
    if (toolState.tool === ToolEnum.DELETE) {
        payload = {
            objectTypeId: streetGrid[cell.posX][cell.posY].objectTypeId,
            x: cell.posX,
            y: cell.posY,
            rotation: streetGrid[cell.posX][cell.posY].rotation,
            game_assets: [],
        }
        streetGrid[cell.posX][cell.posY].objectTypeId = -1
        streetGrid[cell.posX][cell.posY].rotation = 0
        streetGrid[cell.posX][cell.posY].texture = ""
        deleteMessage(payload)
    }
}

// onMouseMove sets texture to all cells over which the mouse is moved while the mouse button is pressed
function onMouseMove(cell: any, event: MouseEvent) {
    let currCellContent = streetGrid[cell.posX][cell.posY]
    // Todo, add check so stomp message will only send when a change is made
    let payload: IMapObject
    if (
        event.buttons === 1 &&
        toolState.tool === ToolEnum.CREATE &&
        toolState.block.objectTypeId !== -1 &&
        toolState.block.groupId !== 2
    ) {
        if (
            currCellContent.objectTypeId !== toolState.block.objectTypeId ||
            (currCellContent.objectTypeId !== toolState.block.objectTypeId &&
                currCellContent.rotation !== toolState.block.rotation)
        ) {
            streetGrid[cell.posX][cell.posY].objectTypeId = toolState.block.objectTypeId
            streetGrid[cell.posX][cell.posY].rotation = toolState.block.rotation
            streetGrid[cell.posX][cell.posY].texture = toolState.block.texture
            payload = {
                objectTypeId: toolState.block.objectTypeId,
                x: cell.posX,
                y: cell.posY,
                rotation: toolState.block.rotation,
                game_assets: [],
            }
            createMessage(payload)
        }
    }
    if (event.buttons === 1 && toolState.tool === ToolEnum.DELETE) {
        if (currCellContent.objectTypeId !== -1) {
            payload = {
                objectTypeId: streetGrid[cell.posX][cell.posY].objectTypeId,
                x: cell.posX,
                y: cell.posY,
                rotation: streetGrid[cell.posX][cell.posY].rotation,
                game_assets: [],
            }
            streetGrid[cell.posX][cell.posY].objectTypeId = -1
            streetGrid[cell.posX][cell.posY].rotation = 0
            streetGrid[cell.posX][cell.posY].texture = ""
            deleteMessage(payload)
        }
    }
}

// converts StreetGrid into json and sends it to backend
function saveStreetGrid() {
    let dto: StreetGridDTO = { mapObjects: Array<IMapObject>() }
    for (let row = 0; row < streetGrid.length; row++) {
        for (let col = 0; col < streetGrid[0].length; col++) {
            let ele = streetGrid[row][col]
            if (ele.objectTypeId !== -1) {
                dto.mapObjects.push({
                    objectTypeId: ele.objectTypeId,
                    x: ele.posX,
                    y: ele.posY,
                    rotation: ele.rotation,
                    game_assets: ele.game_assets,
                })
            }
        }
    }
    postStreetGrid(lobbyState.value.mapId, dto)
}

// load StreetGrid from backend dto
function loadStreetGrid(dto: StreetGridDTO) {
    fillGridEmpty()
    for (let ele of dto.mapObjects) {
        streetGrid[ele.x][ele.y] = {
            objectTypeId: ele.objectTypeId,
            groupId: blockList[ele.objectTypeId].groupId,
            posX: ele.x,
            posY: ele.y,
            rotation: ele.rotation,
            texture: blockList[ele.objectTypeId].texture,
            game_assets: ele.game_assets,
        }
    }
}

function fillGridEmpty() {
    // fill streetGrid with empty IGridElements
    for (let row = 0; row < streetGrid.length; row++) {
        for (let col = 0; col < streetGrid[0].length; col++) {
            streetGrid[row][col] = {
                objectTypeId: -1,
                groupId: -1,
                posX: row,
                posY: col,
                rotation: 0,
                texture: "",
                game_assets: [],
            }
        }
    }
}

function calcCoordAssetX(id: string, relativeX: number) {
    let bodyRect = document.body.getBoundingClientRect()
    let element = document.getElementById(id)
    let posX = 0
    if (element) {
        let elemRect = element.getBoundingClientRect()
        // elemRect.left - bodyRect.left calculates the top left corner of the grid cell
        // + gridSize.value * relativeX calculates where in the grid the asset is placed
        // - assetSize.value / 3 moves the asset so the mid point is in the middle, usually one should use 2 here, but somehow 3 works
        posX = elemRect.left - bodyRect.left + gridSize.size * relativeX - assetSize.value / 2
    }
    return posX
}

function calcCoordAssetY(id: string, relativeY: number) {
    let bodyRect = document.body.getBoundingClientRect()
    let element = document.getElementById(id)
    let posY = 0
    if (element) {
        let elemRect = element.getBoundingClientRect()
        // elemRect.left - bodyRect.left calculates the top left corner of the grid cell
        // + gridSize.value * relativeY calculates where in the grid the asset is placed
        // - assetSize.value / 3 moves the asset so the mid point is in the middle, usually one should use 2 here, but somehow 3 works
        posY = elemRect.top - bodyRect.top + gridSize.size * relativeY - assetSize.value / 2
    }
    return posY
}

// disable right click context menu
window.addEventListener(
    "contextmenu",
    function (e) {
        e.preventDefault()
    },
    false
)
</script>

<template>
    <div v-for="row in streetGrid" class="row no-drag">
        <div
            v-for="ele in row"
            :id="`cell_${ele.posX}_${ele.posY}`"
            class="grid-item grid-size col no-drag"
            @click="onClick(ele, $event)"
            @mousemove="onMouseMove(ele, $event)"
        >
            <img
                v-if="ele.texture != ''"
                :src="ele.texture"
                class="no-drag grid-img"
                draggable="false"
                :style="{ transform: 'rotate(' + ele.rotation * 90 + 'deg)', zIndex: 0 }"
            />
            <div v-for="asset in ele.game_assets">
                <img
                    :src="asset.texture"
                    class="no-drag asset-img"
                    draggable="false"
                    :style="{
                        transform: 'rotate(' + asset.rotation * 90 + 'deg)',
                        left: `${calcCoordAssetX(`cell_${ele.posX}_${ele.posY}`, asset.x)}px`,
                        top: `${calcCoordAssetY(`cell_${ele.posX}_${ele.posY}`, asset.y)}px`,
                    }"
                />
            </div>
        </div>
    </div>
</template>

<style>
.row {
    display: table;
    overflow: scroll;
}

.col {
    display: table-cell;
}

.grid-size {
    min-width: v-bind(gridSizePx);
    max-width: v-bind(gridSizePx);
    min-height: v-bind(gridSizePx);
    max-height: v-bind(gridSizePx);
    width: v-bind(gridSizePx);
    height: v-bind(gridSizePx);
}

.grid-item {
    border: solid 1px black;
    z-index: 0;
}

.grid-img {
    width: 100%;
    height: 100%;
    display: block;
}

.asset-img {
    width: v-bind(assetSizePx);
    height: v-bind(assetSizePx);
    position: absolute;
}

.no-drag {
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
}
</style>
