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
    const activeBlock = reactive({block: defaultBlock});
    /** bus event */
    const {emit, bus} =useEventBus();
    /**entrys in blocklist */
    blockList[0] = { groupId: 0,group: "Testobject1",id: 0,type:"???",name:"straight",heading:0,texture: (pathToPictures+"object-icons/straight.png")};
    blockList[1] = { groupId: 0,group: "Testobject1",id: 1,type:"???",name:"curve",heading:0,texture: (pathToPictures+"object-icons/curve.png")};
    blockList[2] = { groupId: 1,group: "Testobject2",id: 2,type:"???",name:"cross",heading:0,texture: (pathToPictures+"object-icons/cross.png")};

    function onBlockClicked(clickedBlock:any){
        console.log(activeBlock.block.name);
        if(activeBlock.block.id==clickedBlock.id){
            activeBlock.block = defaultBlock;
        }else{
            activeBlock.block = clickedBlock;
        }
        emit("block-select-event", activeBlock.block);
        console.log(activeBlock.block.name);
    }
    const isCreateTool = ref(false);
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
    <div class="list-container">
        <h2 class="list-title">Block List</h2>
        <!-- display container for block list element-->
        <div v-for="element in blockList" class="list-element">
            <button :disabled ="!isCreateTool" :class="element.name === activeBlock.block.name ? 'listButtonActive' : 'listButton'" @click="onBlockClicked(element)">      
                <img v-if="element != null" :src="element.texture" class="list-img"/>
            </button> 
        </div>
    </div>
</template>

<style>
    /** style for block list in general*/
    .list-container{
        list-style-type: none;
        width: 90%;
        height: 90%;
        display: table-row;
        border: solid 1px gray;
        background-color: gray;
        user-select: none;
            -webkit-user-drag: none; 
            -khtml-user-drag: none; 
            -moz-user-drag: none; 
            -o-user-drag: none;
    }
    /** style for list title in blocklist*/
    .list-title{
        margin: 5%;
        width: 90%;
        height: 90%;
        color:black;
        background-color: white;
    }
    /** style for list element in block list*/
    .list-element {
        display: list-item;
        border: solid 1px gray;
        margin: 5%;
    }
    /** style for images in list element*/
    .list-img {
        width: 90%;
        height: 90%;
        display: block;
        border: solid 1px gray;
        margin: 5%;
    }
    /** style for text in list lement*/
    .objectList-text{
        color:black;
    }
    /** style for buttons in list element */
    .listButton{
        border: solid 2px black;
        background-color:darkgray;
    }
    /** style for clicked buttons in list element */
    .listButtonActive{
        border: solid 2px black;
        background-color:orange;
    }
</style>