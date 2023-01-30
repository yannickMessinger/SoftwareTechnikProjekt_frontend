<script setup lang="ts">
import { computed } from "@vue/reactivity"
import { onMounted, onUnmounted, reactive, watch } from "vue"
import type { IGridElement } from "../../services/streetplaner/IGridElement"
import useEventBus from "../../services/eventBus"
import ToolEnum from "../../services/streetplaner/ToolEnum"
import { useGridSize } from "../../services/useGridSize"

import { useBlockList } from "../../services/streetplaner/useBlockList"
import { postStreetGrid } from "../../services/streetplaner/useStreetGridList"
import { IBlockElement } from "../../services/streetplaner/IBlockElement"
import { IMapObject } from "../../services/streetplaner/IMapObject"
import { StreetGridDTO } from "../../services/streetplaner/StreetGridDTO"
import useUser from "../../services/UserStore"
import UserStore from "../../services/UserStore"
import { useEditor } from "../../services/Editor/useEditor"
import { useGameView } from "../../services/3DGameView/useGameView"
import { IGameAsset2D } from "../../services/streetplaner/IGameAsset2D"
import { useValidation } from "../../services/streetplaner/useValidation"

var gridSizeX = 20
var gridSizeY = 30

const straightObjTypeId = 0
const curveObjTypeId = 1
const intersectionObjTypeId = 2
const straightRailObjTypeId = 9
const curveRailObjTypeId = 10
const trainStationObjTypeId = 11
const railRoadCrossObjTypeId = 12
const pedestrianCrossingObjTypeId = 8
const npcCarObjTypeId = 7
const trainObjTypeId = 14
const playerSpawnObjTypeId = 13
const firstPedestrianId = 50
const pedestrianAmount = 10

// initialize gridSize
const { gridSize } = useGridSize()
// initialize gridSizePx used in css
const gridSizePx = computed(() => gridSize.size.toString() + "px")
const assetSize = computed(() => gridSize.size / 4)
const assetSizePx = computed(() => assetSize.value.toString() + "px")

const { userId } = UserStore()
const { bus, emit } = useEventBus()
const { setGameStateMapId } = useGameView()
const { blockListState, updateBlockList } = useBlockList()
const {
    initValidator,
    checkStraightValid,
    checkCurveValid,
    checkIntersectionValid,
    checkStraightRailValid,
    checkCurveRailValid,
    checkRailRoadCrossingValid,
} = useValidation()

const toolState = reactive({
    tool: ToolEnum.EMPTY,
    block: { objectTypeId: -1, groupId: -1, rotation: 0, texture: "" },
})
const lobbyState = useUser().activeLobby

const {
    editorState,
    createMessage,
    deleteMessage,
    updateMessage,
    resetMessage,
    updateMap,
    receiveEditorUpdates,
    updateMapId,
} = useEditor(lobbyState.value!.mapId)

// create and initialize streetGrid
const streetGrid: IGridElement[][] = reactive(
    Array(gridSizeX)
        .fill([])
        .map(() => Array(gridSizeY).fill(null))
)
fillGridEmpty()

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
        let changedElements: Array<IMapObject> = []
        changedElements.push(...placeAssetOnRandomElement(val[0].car, 7))
        changedElements.push(...placeAssetOnRandomElement(val[0].pedestrian, 50))
        changedElements = [...new Set(changedElements.filter((ele) => ele !== undefined))]
        changedElements.forEach((ele) => updateMessage(ele))
    }
)
watch(
    () => bus.value.get("grid-is-valid-event"),
    (val) => {
        if (val) {
            checkValidation()
        }
    }
)
watch(
    () => bus.value.get("validate-grid-event"),
    () => {
        let isValid = checkValidation()
        emit("is-valid-event", isValid)
    }
)

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

    initValidator(streetGrid, gridSizeX, gridSizeY)

    updateBlockList()
    receiveEditorUpdates()
    updateMapId(lobbyState.value!.mapId)
    setGameStateMapId(lobbyState.value!.mapId)
    updateMap()
})

onUnmounted(() => {
    let playerSpawnMapObject = editorState.mapObjects.filter((mapObject) => {
        return (
            mapObject.game_assets.filter((asset) => {
                return asset.userId === userId.value
            }).length > 0
        )
    })
    if (playerSpawnMapObject.length === 0) {
        placeAssetOnRandomElement(1, playerSpawnObjTypeId).forEach((ele) => updateMessage(ele))
    }
})

function checkValidation(): boolean {
    let isValid: boolean = true
    if (!validateStreetGrid()) isValid = false
    if (!validateRailGrid()) isValid = false
    return isValid
}

function validateStreetGrid(): boolean {
    let isValid: boolean = true
    let streetElements = editorState.mapObjects.filter((ele) => blockList[ele.objectTypeId].type === "STREET")
    for (let streetEle of streetElements) {
        switch (streetEle.objectTypeId) {
            case straightObjTypeId:
            case pedestrianCrossingObjTypeId:
                if (!checkStraightValid(streetEle)) {
                    streetGrid[streetEle.x][streetEle.y].isValid = false
                    isValid = false
                }
                break
            case intersectionObjTypeId:
                if (!checkIntersectionValid(streetEle)) {
                    streetGrid[streetEle.x][streetEle.y].isValid = false
                    isValid = false
                }
                break
            case curveObjTypeId:
                if (!checkCurveValid(streetEle)) {
                    streetGrid[streetEle.x][streetEle.y].isValid = false
                    isValid = false
                }
                break
        }
    }
    return isValid
}

function validateRailGrid(): boolean {
    let isValid: boolean = true
    let railElements = editorState.mapObjects.filter(
        (ele) => blockList[ele.objectTypeId].type === "RAIL" || blockList[ele.objectTypeId].type === "STREET_RAIL"
    )
    for (let railEle of railElements) {
        switch (railEle.objectTypeId) {
            case straightRailObjTypeId:
            case trainStationObjTypeId:
                if (!checkStraightRailValid(railEle)) {
                    streetGrid[railEle.x][railEle.y].isValid = false
                    isValid = false
                }
                break
            case curveRailObjTypeId:
                if (!checkCurveRailValid(railEle)) {
                    streetGrid[railEle.x][railEle.y].isValid = false
                    isValid = false
                }
                break
            case railRoadCrossObjTypeId:
                if (!checkRailRoadCrossingValid(railEle)) {
                    streetGrid[railEle.x][railEle.y].isValid = false
                    isValid = false
                }
                break
        }
    }
    return isValid
}

function placeAssetOnRandomElement(amountAssets: number, assetObjectId: number): IMapObject[] {
    let counter = 0
    let errorCounter = 0
    let changedElements: Array<IMapObject> = []
    // only place random npc assets on straight
    let availableElements: IMapObject[] = editorState.mapObjects.filter((ele) => ele.objectTypeId === 0)
    while (counter !== amountAssets) {
        let randomIndex = Math.floor(Math.random() * availableElements.length)
        let randomElement = availableElements[randomIndex]
        // try to place asset on random element
        if (placeRandomAssetOnElement(randomElement, assetObjectId)) {
            if (changedElements.includes(randomElement)) {
                delete changedElements[changedElements.indexOf(randomElement)]
            }
            changedElements.push(availableElements[randomIndex])
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
    return changedElements
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
                            { x: 0.15, y: i, rotation: pedRotation },
                            { x: 0.95, y: i, rotation: pedRotation },
                        ]
                    )
                    // rotation 2
                    pedRotation = 2
                    randomPosElements.push(
                        ...[
                            { x: 0.05, y: i, rotation: pedRotation },
                            { x: 0.85, y: i, rotation: pedRotation },
                        ]
                    )
                }
            } else if (element.rotation % 2 === 1) {
                for (let i = 0.125; i < 1; i += 0.125) {
                    // rotation 1
                    let pedRotation = 1
                    randomPosElements.push(
                        ...[
                            { x: i, y: 0.15, rotation: pedRotation },
                            { x: i, y: 0.95, rotation: pedRotation },
                        ]
                    )
                    // rotation 3
                    pedRotation = 3
                    randomPosElements.push(
                        ...[
                            { x: i, y: 0.05, rotation: pedRotation },
                            { x: i, y: 0.85, rotation: pedRotation },
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

// tries to place random asset on an elment, returns true if asset was placed, else false
function placeRandomAssetOnElement(element: IMapObject, assetObjectTypeId: number): boolean {
    let randomPosElements: Array<{ x: number; y: number; rotation: number }> = []
    if (assetObjectTypeId === npcCarObjTypeId || assetObjectTypeId === playerSpawnObjTypeId) {
        randomPosElements = getRandomSpawnsCar(element)
    }
    // if (50 <= assetId < 60), then asset = pedestrian
    else if (assetObjectTypeId >= firstPedestrianId && assetObjectTypeId < firstPedestrianId + pedestrianAmount) {
        randomPosElements = getRandomSpawnsPedestrian(element)
    }

    // check if the max capacity is reached
    if (element.game_assets.length === randomPosElements.length) {
        return false
    }

    let randomPos = Math.floor(Math.random() * randomPosElements.length)
    if (checkAssetPlacedNearElement(element.game_assets, randomPosElements[randomPos])) {
        randomPos = 0
        while (randomPos < randomPosElements.length) {
            if (checkAssetPlacedNearElement(element.game_assets, randomPosElements[randomPos])) {
                randomPos++
            } else {
                if (assetObjectTypeId === playerSpawnObjTypeId) {
                    streetGrid[element.x][element.y].game_assets.push({
                        objectTypeId: assetObjectTypeId,
                        userId: userId.value,
                        x: randomPosElements[randomPos].x,
                        y: randomPosElements[randomPos].y,
                        rotation: randomPosElements[randomPos].rotation,
                        texture: blockList.find((ele) => ele.objectTypeId === assetObjectTypeId)!.texture,
                        isValid: true,
                    })
                } else {
                    streetGrid[element.x][element.y].game_assets.push({
                        objectTypeId: assetObjectTypeId,
                        x: randomPosElements[randomPos].x,
                        y: randomPosElements[randomPos].y,
                        rotation: randomPosElements[randomPos].rotation,
                        texture: blockList.find((ele) => ele.objectTypeId === assetObjectTypeId)!.texture,
                        isValid: true,
                    })
                }
                return true
            }
        }
    } else {
        if (assetObjectTypeId === playerSpawnObjTypeId) {
            streetGrid[element.x][element.y].game_assets.push({
                objectTypeId: assetObjectTypeId,
                userId: userId.value,
                x: randomPosElements[randomPos].x,
                y: randomPosElements[randomPos].y,
                rotation: randomPosElements[randomPos].rotation,
                texture: blockList.find((ele) => ele.objectTypeId === assetObjectTypeId)!.texture,
                isValid: true,
            })
        } else {
            streetGrid[element.x][element.y].game_assets.push({
                objectTypeId: assetObjectTypeId,
                x: randomPosElements[randomPos].x,
                y: randomPosElements[randomPos].y,
                rotation: randomPosElements[randomPos].rotation,
                texture: blockList.find((ele) => ele.objectTypeId === assetObjectTypeId)!.texture,
                isValid: true,
            })
        }
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
            // only place asset if it's placed on a straight road
            if (currCellContent.objectTypeId === straightObjTypeId) {
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
                if (toolState.block.objectTypeId === playerSpawnObjTypeId) {
                    // if asset is spawnpoint
                    let oldSpawnCell = editorState.mapObjects.filter(
                        (ele) => ele.game_assets.filter((asset) => asset.userId === userId.value).length
                    )
                    for (let oldCell of oldSpawnCell) {
                        payload = {
                            objectTypeId: oldCell.objectTypeId,
                            x: oldCell.x,
                            y: oldCell.y,
                            rotation: oldCell.rotation,
                            game_assets: oldCell.game_assets.filter((asset) => asset.userId !== userId.value),
                        }

                        updateMessage(payload)
                    }
                    streetGrid[cell.posX][cell.posY].game_assets.push({
                        objectTypeId: toolState.block.objectTypeId,
                        x: x,
                        y: y,
                        rotation: toolState.block.rotation,
                        texture: toolState.block.texture,
                        userId: userId.value,
                        isValid: true,
                    })
                } else {
                    streetGrid[cell.posX][cell.posY].game_assets.push({
                        objectTypeId: toolState.block.objectTypeId,
                        x: x,
                        y: y,
                        rotation: toolState.block.rotation,
                        texture: toolState.block.texture,
                        isValid: true,
                    })
                }

                payload = {
                    objectId: -1,
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
            if (toolState.block.objectTypeId === trainStationObjTypeId) {
                let newGameAssets = []
                newGameAssets.push({
                    objectTypeId: trainObjTypeId,
                    x: 0.5,
                    y: 0.5,
                    rotation: toolState.block.rotation,
                    texture: blockList[trainObjTypeId].texture,
                    userId: 0,
                    isValid: true,
                })
                payload = {
                    objectId: -1,
                    objectTypeId: toolState.block.objectTypeId,
                    x: cell.posX,
                    y: cell.posY,
                    rotation: toolState.block.rotation,
                    game_assets: newGameAssets,
                }
            } else {
                payload = {
                    objectId: -1,
                    objectTypeId: toolState.block.objectTypeId,
                    x: cell.posX,
                    y: cell.posY,
                    rotation: toolState.block.rotation,
                    game_assets: streetGrid[cell.posX][cell.posY].game_assets,
                }
            }
            createMessage(payload)
        }
    }
    if (toolState.tool == ToolEnum.ROTATE && streetGrid[cell.posX][cell.posY].objectTypeId !== -1) {
        streetGrid[cell.posX][cell.posY].rotation = (streetGrid[cell.posX][cell.posY].rotation + 1) % 4
        payload = {
            objectId: -1,
            objectTypeId: streetGrid[cell.posX][cell.posY].objectTypeId,
            x: cell.posX,
            y: cell.posY,
            rotation: streetGrid[cell.posX][cell.posY].rotation,
            game_assets: streetGrid[cell.posX][cell.posY].game_assets,
        }
        updateMessage(payload)
    }
    if (toolState.tool === ToolEnum.DELETE) {
        if (e.target.classList.contains("asset-img")) {
            let clickedAsset = currCellContent.game_assets[e.target.__vnode.key]
            if (clickedAsset.userId === userId.value || clickedAsset.userId === 0) {
                let newGameAssets = streetGrid[cell.posX][cell.posY].game_assets
                newGameAssets.splice(e.target.__vnode.key, 1)
                payload = {
                    objectTypeId: streetGrid[cell.posX][cell.posY].objectTypeId,
                    x: cell.posX,
                    y: cell.posY,
                    rotation: streetGrid[cell.posX][cell.posY].rotation,
                    game_assets: newGameAssets,
                }
                updateMessage(payload)
            }
        } else {
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
    console.log(editorState.mapObjects)
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
        streetGrid[cell.posX][cell.posY].objectTypeId = toolState.block.objectTypeId
        streetGrid[cell.posX][cell.posY].rotation = toolState.block.rotation
        streetGrid[cell.posX][cell.posY].texture = toolState.block.texture
        payload = {
            objectId: -1,
            objectTypeId: toolState.block.objectTypeId,
            x: cell.posX,
            y: cell.posY,
            rotation: toolState.block.rotation,
            game_assets: [],
        }
        createMessage(payload)
    }
    if (event.buttons === 1 && toolState.tool === ToolEnum.DELETE) {
        if (currCellContent.objectTypeId !== -1) {
            payload = {
                objectId: -1,
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
                    objectId: -1,
                    objectTypeId: ele.objectTypeId,
                    x: ele.posX,
                    y: ele.posY,
                    rotation: ele.rotation,
                    game_assets: ele.game_assets,
                })
            }
        }
    }
    postStreetGrid(lobbyState.value!.mapId, dto)
}

// load StreetGrid from backend dto
function loadStreetGrid(dto: StreetGridDTO) {
    fillGridEmpty()
    for (let ele of dto.mapObjects) {
        ele.game_assets.forEach((gameAsset) => {
            gameAsset.isValid = true
        })
        streetGrid[ele.x][ele.y] = {
            objectTypeId: ele.objectTypeId,
            groupId: blockList[ele.objectTypeId].groupId,
            posX: ele.x,
            posY: ele.y,
            rotation: ele.rotation,
            texture: blockList[ele.objectTypeId].texture,
            game_assets: ele.game_assets,
            isValid: true,
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
                isValid: true,
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
                v-if="!ele.isValid"
                :src="ele.texture"
                class="no-drag grid-img"
                draggable="false"
                :style="{
                    transform: 'rotate(' + ele.rotation * 90 + 'deg)',
                    zIndex: 0,
                    filter: 'brightness(0.5) sepia(1) saturate(2000%)',
                }"
            />
            <img
                v-if="ele.texture != '' && ele.isValid"
                :src="ele.texture"
                class="no-drag grid-img"
                draggable="false"
                :style="{ transform: 'rotate(' + ele.rotation * 90 + 'deg)', zIndex: 0 }"
            />
            <div v-for="(asset, index) in ele.game_assets">
                <!-- if asset is npc (asset.userId not present or 0) or asset is our spawnpoint (asset.userId === our userId) use given asset.texture -->
                <img
                    v-if="(!asset.userId || asset.userId === 0 || asset.userId === userId?.valueOf()) && !asset.isValid"
                    :src="asset.texture"
                    class="no-drag asset-img"
                    draggable="false"
                    :style="{
                        transform: 'rotate(' + asset.rotation * 90 + 'deg)',
                        left: `${calcCoordAssetX(`cell_${ele.posX}_${ele.posY}`, asset.x)}px`,
                        top: `${calcCoordAssetY(`cell_${ele.posX}_${ele.posY}`, asset.y)}px`,
                        backgroundColor: 'red',
                    }"
                />
                <img
                    v-if="(!asset.userId || asset.userId === 0 || asset.userId === userId?.valueOf()) && asset.isValid"
                    :src="asset.texture"
                    :key="index"
                    class="no-drag asset-img"
                    draggable="false"
                    :style="{
                        transform: 'rotate(' + asset.rotation * 90 + 'deg)',
                        left: `${calcCoordAssetX(`cell_${ele.posX}_${ele.posY}`, asset.x)}px`,
                        top: `${calcCoordAssetY(`cell_${ele.posX}_${ele.posY}`, asset.y)}px`,
                    }"
                />
                <!-- else the asset is not our spawnpoint nor a npc car, so asset is another players car -->
                <img
                    v-if="!(!asset.userId || asset.userId === 0 || asset.userId === userId?.valueOf()) && asset.isValid"
                    src="/img/streetplaner/object-icons/car-top-view-green.svg"
                    class="no-drag asset-img"
                    draggable="false"
                    :style="{
                        transform: 'rotate(' + asset.rotation * 90 + 'deg)',
                        left: `${calcCoordAssetX(`cell_${ele.posX}_${ele.posY}`, asset.x)}px`,
                        top: `${calcCoordAssetY(`cell_${ele.posX}_${ele.posY}`, asset.y)}px`,
                    }"
                />
                <img
                    v-if="
                        !(!asset.userId || asset.userId === 0 || asset.userId === userId?.valueOf()) && !asset.isValid
                    "
                    src="/img/streetplaner/object-icons/car-top-view-green.svg"
                    class="no-drag asset-img"
                    draggable="false"
                    :style="{
                        transform: 'rotate(' + asset.rotation * 90 + 'deg)',
                        left: `${calcCoordAssetX(`cell_${ele.posX}_${ele.posY}`, asset.x)}px`,
                        top: `${calcCoordAssetY(`cell_${ele.posX}_${ele.posY}`, asset.y)}px`,
                        backgroundColor: 'red',
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
