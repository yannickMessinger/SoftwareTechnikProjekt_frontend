<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive, ref, watch } from 'vue';
    import type { IBlockElement } from '../../services/streetplaner/IBlockElement';
    import useEventBus from '../../services/eventBus';
    import ToolEnum from '../../services/streetplaner/ToolEnum';

    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    var totalBlockNumber = 3; /** number of blocks in blocklist*/
    var blockList: IBlockElement[] = Array(totalBlockNumber).fill([]); /** List of all blocks placable in street editor*/
    
    /*default block element*/
    var defaultBlock: IBlockElement = { 
        groupId: -1,
        group: "no data",
        id: -1,
        type:"no data",
        name:"no Object selected",
        heading:0,
        texture: (pathToPictures+"no-data.png")
    };
    /**  currently selected block */
    const selectedBlock = reactive({block: defaultBlock});
    /** bus event */
    const {emit, bus} =useEventBus();
    /** boolean value that controls weather blocks are clicable or not */
    const isCreateTool = ref(false);
    /**entrys in blocklist */
    blockList[0] = { groupId: 0,group: "Testobject1",id: 0,type:"???",name:"straight",heading:0,texture: (pathToPictures+"object-icons/straight.png")};
    blockList[1] = { groupId: 0,group: "Testobject1",id: 1,type:"???",name:"curve",heading:0,texture: (pathToPictures+"object-icons/curve.png")};
    blockList[2] = { groupId: 1,group: "Testobject2",id: 2,type:"???",name:"cross",heading:0,texture: (pathToPictures+"object-icons/cross.png")};

    /**function activated by clicking on an block */
    function onBlockClicked(clickedBlock:any){
        console.log(selectedBlock.block.name);
        /** if the selected block is the clicked block, it gets deselected by restoring the default block
         * otherwhise the clicked block is now the selected block.
        */
        if(selectedBlock.block.id==clickedBlock.id){
            selectedBlock.block = defaultBlock;
        }else{
            selectedBlock.block = clickedBlock;
        }
        /** fires a block select event to mark a selected block change. Sends out this blocks name*/
        emit("block-select-event", selectedBlock.block);
        console.log(selectedBlock.block.name);
    }

    /** sets buttons to clickable if create tool is selected, or not clickable if its not */
    watch(() =>  bus.value.get('tool-select-event'), (val) => {
        if(val == ToolEnum.CREATE){
            isCreateTool.value = true;
        }else{
            isCreateTool.value = false;
        }
    });
</script>

<template>
    <!--display container for block list-->
    <h2 class="blockListTitle">Block List</h2>
    <div class="blockListContainer">
        <!-- display container for block list element-->
        <div v-for="element in blockList" class="blockListElement">
            <button :disabled ="!isCreateTool" :class="element.name === selectedBlock.block.name ? 'blockListButtonActive' : 'blockListButton'" @click="onBlockClicked(element)">      
                <img v-if="element != null" :src="element.texture" class="blockListImg"/>
            </button> 
        </div>
    </div>
</template>

<style>
    /** style for list title in blocklist*/
    .blockListTitle{
        color:black;
        background-color: white;
        text-align: center;
        margin:5%;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    /** style for block list in general*/
    .blockListContainer{
        margin: 5%;
        list-style-type: none;
        overflow-y: scroll;
        overflow-x: hidden;
        max-block-size: 19vh;
        background-color: gray;
        user-select: none;
            -webkit-user-drag: none; 
            -khtml-user-drag: none; 
            -moz-user-drag: none; 
            -o-user-drag: none;
    }
    /** style for list element in block list*/
    .blockListElement{
        margin:1%;
        display:inline-flex;
        max-height: 45%;
        max-width: 45%;
    }
    /** style for images in list element*/
    .blockListImg {
        width: 100%;
        height: 100%;
    }
    /** style for buttons in list element */
    .blockListButton{
        border: solid 2px black;
        background-color:darkgray;
    }
    /** style for clicked buttons in list element */
    .blockListButtonActive{
        border: solid 2px black;
        background-color:orange;
    }
</style>