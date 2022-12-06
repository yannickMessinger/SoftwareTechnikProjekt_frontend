<script setup lang="ts">
    import { computed } from '@vue/reactivity';
    import { ref, reactive, watch, onMounted } from 'vue';
    import type { IGridElement } from '../../services/streetplaner/IGridElement';
    import useEventBus from '../../services/eventBus';
    import ToolEnum from '../../services/streetplaner/ToolEnum';
    import { useBlockList, updateBlockList } from '../../services/streetplaner/useBlockList';
    import { useStreetGridList, updateStreetGridList, postStreetGrid } from '../../services/streetplaner/useStreetGridList';
    import { IBlockElement } from '../../services/streetplaner/IBlockElement';
    import { IStreetElement } from '../../services/streetplaner/IStreetElement';
    import { StreetGridDTO } from '../../services/streetplaner/StreetGridDTO';
    const { bus } = useEventBus();

    var gridSizeX = 20;
    var gridSizeY = 30;
    const toolState = reactive({ tool: ToolEnum.EMPTY, block: { id: -1, rotation: 0, texture: "" } });

    watch(() => bus.value.get('tool-select-event'), (val) => {
        toolState.tool = val[0];
        // console.log(toolState.tool);
    });
    watch(() => bus.value.get('block-select-event'), (val) => {
        toolState.block = val[0];
        // console.log(toolState.block);
    });
    watch(() => bus.value.get('grid-reset-event'), (val) => {
        if (val) { resetGrid(); }
    });
    watch(() => bus.value.get('grid-save-event'), (val) => { saveStreetGrid(); });

    // create and initialize streetGrid
    const streetGrid: IGridElement[][] = reactive(Array(gridSizeX).fill([]).map(() => Array(gridSizeY).fill(null)));
    resetGrid();

    // initialize gridSize
    const gridSize = ref(40);
    // initialize gridSizePx used in css
    const gridSizePx = computed(() => gridSize.value.toString() + "px");
    // declare blockList
    var blockList: Array<IBlockElement>;
    var streetGridDTO: StreetGridDTO;

    onMounted(() => {
        blockList = useBlockList().blockList;
        streetGridDTO = useStreetGridList().streetGridDTO;
        updateBlockList();
        updateStreetGridList().then(() => {
            loadStreetGrid(streetGridDTO);
        });

    });

    // onClick handles click on specific cell
    function onClick(cell: any) {
        // set texture of clicked cell to dummy
        if (toolState.tool === ToolEnum.CREATE && toolState.block.id !== -1) {
            streetGrid[cell.posX][cell.posY].id = toolState.block.id;
            streetGrid[cell.posX][cell.posY].rotation = toolState.block.rotation;
            streetGrid[cell.posX][cell.posY].texture = toolState.block.texture;
        }
        if (toolState.tool == ToolEnum.ROTATE) {
            streetGrid[cell.posX][cell.posY].rotation = (streetGrid[cell.posX][cell.posY].rotation + 1) % 4;
        }
        if (toolState.tool === ToolEnum.DELETE) {
            streetGrid[cell.posX][cell.posY].id = -1;
            streetGrid[cell.posX][cell.posY].rotation = 0;
            streetGrid[cell.posX][cell.posY].texture = "";
        }
    }

    // onMouseMove sets texture to all cells over which the mouse is moved while the mouse button is pressed
    function onMouseMove(cell: any, event: any) {
        if (event.buttons === 1 && toolState.tool === ToolEnum.CREATE && toolState.block.id !== -1) {
            streetGrid[cell.posX][cell.posY].id = toolState.block.id;
            streetGrid[cell.posX][cell.posY].rotation = toolState.block.rotation;
            streetGrid[cell.posX][cell.posY].texture = toolState.block.texture;
        }
        if (event.buttons === 1 && toolState.tool === ToolEnum.DELETE) {
            streetGrid[cell.posX][cell.posY].id = -1;
            streetGrid[cell.posX][cell.posY].rotation = 0;
            streetGrid[cell.posX][cell.posY].texture = "";
        }
    }
    
    function saveStreetGrid() {
        let dto: StreetGridDTO = { Strassenobjekte: Array<IStreetElement>() };
        for(let row=0; row<streetGrid.length; row++) {
            for(let col=0; col<streetGrid[0].length; col++) {
                let ele = streetGrid[row][col];
                if(ele.id !== -1) {
                    dto.Strassenobjekte.push( { Objekt_ID: ele.id, 
                                                X: ele.posX,
                                                Y: ele.posY,
                                                Rotation: ele.rotation
                                            } );
                }
            }
        }
        postStreetGrid(dto);
    }
    
    function loadStreetGrid(dto: StreetGridDTO) {
        resetGrid();
        for(let ele of dto.Strassenobjekte) {
            streetGrid[ele.X][ele.Y] = { 
                id: ele.Objekt_ID, 
                posX: ele.X, 
                posY: ele.Y, 
                rotation: ele.Rotation, 
                texture: blockList[ele.Objekt_ID].texture};
        }
    }

    function resetGrid() {
        // fill streetGrid with empty IGridElements
        for(let row=0; row<streetGrid.length; row++) {
            for(let col=0; col<streetGrid[0].length; col++) {
                streetGrid[row][col] = { id: -1, posX: row, posY: col, rotation: 0, texture: ""};
            }
        }
    }

    // disable right click context menu
    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
</script>

<template>
    <div v-for="row in streetGrid" class="row no-drag">
        <div v-for="ele in row" class="grid-item grid-size col no-drag" @click="onClick(ele)" @mousemove="onMouseMove(ele, $event)">
            <img v-if="ele.texture != ''" :src="ele.texture" class="no-drag grid-img" draggable="false" :style="{ transform: 'rotate(' + ele.rotation * 90 + 'deg)' }"/>
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
        border: solid 1px white;
    }
    .grid-img {
        width: 100%;
        height: 100%;
        display: block;
    }
    .no-drag {  
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none; 
    }
</style>