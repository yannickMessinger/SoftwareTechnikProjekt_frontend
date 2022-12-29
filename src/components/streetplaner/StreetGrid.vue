<script setup lang="ts">
    import { computed } from "@vue/reactivity"
    import { ref, reactive, watch, onMounted } from "vue"
    import type { IGridElement } from "../../services/streetplaner/IGridElement"
    import useEventBus from "../../services/eventBus"
    import ToolEnum from "../../services/streetplaner/ToolEnum"
    import {
        useBlockList,
        updateBlockList,
    } from "../../services/streetplaner/useBlockList"
    import {
        useStreetGridList,
        updateStreetGridList,
        postStreetGrid,
    } from "../../services/streetplaner/useStreetGridList"
    import { IBlockElement } from "../../services/streetplaner/IBlockElement"
    import { IMapObject } from "../../services/streetplaner/IMapObject"
    import { StreetGridDTO } from "../../services/streetplaner/StreetGridDTO"
    import useUser from "../../services/UserStore"
    import { useEditor } from "../../services/Editor/useEditor"
    const { bus } = useEventBus()

    var gridSizeX = 20
    var gridSizeY = 30
    const toolState = reactive({
        tool: ToolEnum.EMPTY,
        block: { id: -1, rotation: 0, texture: "" },
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
        (val) => {
            saveStreetGrid()
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
    const gridSize = ref(40)
    // initialize gridSizePx used in css
    const gridSizePx = computed(() => gridSize.value.toString() + "px")
    const assetSizePx = computed(() => (gridSize.value / 4).toString() + "px")
    // declare blockList
    var blockList: Array<IBlockElement>
    watch(
        () => editorState.mapObjects,
        () => loadStreetGrid(editorState)
    )

    onMounted(() => {
        // get blockList from backend
        // get streetgrid from backend via mapID
        blockList = useBlockList().blockList
        updateBlockList()
        receiveEditorUpdates()
        updateMapId(lobbyState.value.mapId)
        updateMap()
    })

    // onClick handles click on specific cell
    function onClick(cell: any, e: any) {
        let currCellContent = streetGrid[cell.posX][cell.posY]
        let payload: IMapObject
        if (toolState.tool === ToolEnum.CREATE && toolState.block.id !== -1) {
            // Todo, cars only placeable on roads
            if (toolState.block.id === 7) {
                if (currCellContent.id !== -1) {
                    let rect = e.target.getBoundingClientRect()
                    let x = (e.clientX - rect.left) / gridSize.value
                    let y = (e.clientY - rect.top) / gridSize.value
                    streetGrid[cell.posX][cell.posY].game_assets.push({
                        objectTypeId: toolState.block.id,
                        x: x,
                        y: y,
                        rotation: toolState.block.rotation,
                        texture: toolState.block.texture,
                    })
                    payload = {
                        objectTypeId: currCellContent.id,
                        x: cell.posX,
                        y: cell.posY,
                        rotation: currCellContent.rotation,
                        game_assets:
                            streetGrid[cell.posX][cell.posY].game_assets,
                    }
                    updateMessage(payload)
                }
            } else {
                streetGrid[cell.posX][cell.posY].id = toolState.block.id
                streetGrid[cell.posX][cell.posY].rotation =
                    toolState.block.rotation
                streetGrid[cell.posX][cell.posY].texture =
                    toolState.block.texture
                payload = {
                    objectTypeId: toolState.block.id,
                    x: cell.posX,
                    y: cell.posY,
                    rotation: toolState.block.rotation,
                    game_assets: streetGrid[cell.posX][cell.posY].game_assets,
                }
                createMessage(payload)
            }
        }
        if (
            toolState.tool == ToolEnum.ROTATE &&
            streetGrid[cell.posX][cell.posY].id !== -1
        ) {
            streetGrid[cell.posX][cell.posY].rotation =
                (streetGrid[cell.posX][cell.posY].rotation + 1) % 4
            payload = {
                objectTypeId: streetGrid[cell.posX][cell.posY].id,
                x: cell.posX,
                y: cell.posY,
                rotation: streetGrid[cell.posX][cell.posY].rotation,
                game_assets: streetGrid[cell.posX][cell.posY].game_assets,
            }
            updateMessage(payload)
        }
        if (toolState.tool === ToolEnum.DELETE) {
            payload = {
                objectTypeId: streetGrid[cell.posX][cell.posY].id,
                x: cell.posX,
                y: cell.posY,
                rotation: streetGrid[cell.posX][cell.posY].rotation,
                game_assets: [],
            }
            streetGrid[cell.posX][cell.posY].id = -1
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
            toolState.block.id !== -1 &&
            toolState.block.id !== 7
        ) {
            if (
                currCellContent.id !== toolState.block.id ||
                (currCellContent.id !== toolState.block.id &&
                    currCellContent.rotation !== toolState.block.rotation)
            ) {
                streetGrid[cell.posX][cell.posY].id = toolState.block.id
                streetGrid[cell.posX][cell.posY].rotation =
                    toolState.block.rotation
                streetGrid[cell.posX][cell.posY].texture =
                    toolState.block.texture
                payload = {
                    objectTypeId: toolState.block.id,
                    x: cell.posX,
                    y: cell.posY,
                    rotation: toolState.block.rotation,
                    game_assets: [],
                }
                createMessage(payload)
            }
        }
        if (event.buttons === 1 && toolState.tool === ToolEnum.DELETE) {
            if (currCellContent.id !== -1) {
                payload = {
                    objectTypeId: streetGrid[cell.posX][cell.posY].id,
                    x: cell.posX,
                    y: cell.posY,
                    rotation: streetGrid[cell.posX][cell.posY].rotation,
                    game_assets: [],
                }
                streetGrid[cell.posX][cell.posY].id = -1
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
                if (ele.id !== -1) {
                    dto.mapObjects.push({
                        objectTypeId: ele.id,
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
        console.log(dto.mapObjects)
        for (let ele of dto.mapObjects) {
            streetGrid[ele.x][ele.y] = {
                id: ele.objectTypeId,
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
                    id: -1,
                    posX: row,
                    posY: col,
                    rotation: 0,
                    texture: "",
                    game_assets: [],
                }
            }
        }
    }

    function calcCoordX(id: string, relativeX: number) {
        let bodyRect = document.body.getBoundingClientRect()
        let element = document.getElementById(id)
        let posX = 0
        if (element) {
            let elemRect = element.getBoundingClientRect()
            posX = elemRect.left - bodyRect.left + gridSize.value * relativeX
        }
        return posX
    }

    function calcCoordY(id: string, relativeY: number) {
        let bodyRect = document.body.getBoundingClientRect()
        let element = document.getElementById(id)
        let posY = 0
        if (element) {
            let elemRect = element.getBoundingClientRect()
            posY = elemRect.top - bodyRect.top + gridSize.value * relativeY
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
            class="grid-item grid-size col no-drag"
            @click="onClick(ele, $event)"
            @mousemove="onMouseMove(ele, $event)"
            :id="`cell_${ele.posX}_${ele.posY}`"
        >
            <img
                v-if="ele.texture != ''"
                :src="ele.texture"
                class="no-drag grid-img"
                draggable="false"
                :style="{ transform: 'rotate(' + ele.rotation * 90 + 'deg)' }"
            />
            <div v-for="asset in ele.game_assets">
                <img
                    :src="asset.texture"
                    class="no-drag asset-img"
                    draggable="false"
                    :style="{
                        transform: 'rotate(' + asset.rotation * 90 + 'deg)',
                        left:
                            calcCoordX(
                                `cell_${ele.posX}_${ele.posY}`,
                                asset.x
                            ) + 'px',
                        top:
                            calcCoordY(
                                `cell_${ele.posX}_${ele.posY}`,
                                asset.y
                            ) + 'px',
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
