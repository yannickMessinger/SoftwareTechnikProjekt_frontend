<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive } from 'vue';
    import type { IToolElement } from '../../services/streetplaner/IToolElement';
    import useEventBus from '../../services/eventBus';
    import ToolEnum from '../../services/streetplaner/ToolEnum'
    
    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    var totalToolNumber = 4; /** number of toolslots shown in the toollist */
    var toolList: IToolElement[] = Array(totalToolNumber).fill([]); /** List of all Tools */
    /** default values for selected tool when no tool is selected */
    var defaultTool: IToolElement = {
        tool: ToolEnum.EMPTY,
        id: -1, 
        name: "no Tool selected",
        texture: (pathToPictures+"no-data.png")
    };
    /** currently selected tool */
    const selectedTool = reactive({tool: defaultTool});
    const {emit}=useEventBus();
    
    
    /**entrys in toollist */ 
    toolList[0] = { tool: ToolEnum.CREATE, id: 0, name: "create", texture: (pathToPictures+"tool-icons/create.png")};
    toolList[1] = { tool: ToolEnum.DELETE, id: 1, name: "delete", texture: (pathToPictures+"tool-icons/delete.png")};
    toolList[2] = { tool: ToolEnum.EDIT, id: 2, name: "edit", texture: (pathToPictures+"tool-icons/edit.png")};
    toolList[3] = { tool: ToolEnum.ROTATE, id: 3, name: "rotate", texture: (pathToPictures+"tool-icons/rotate.png")};
        
    function onToolClick(clickedTool:any){
        /** if the selected tool is the clicked tool, it gets deselected by restoring the default tool
         * otherwhise the clicked tool is now the selected tool.
        */
        console.log(selectedTool.tool.name);
        if(selectedTool.tool.id==clickedTool.id){
            selectedTool.tool = defaultTool;
        }else{
            selectedTool.tool = clickedTool;
        }
        /** fire a tool select event to mark a tool change. Sends out the enum value of the selected tool*/
        emit('tool-select-event', selectedTool.tool.tool);
        /** fire a tool select event to mark a tool change for selectedToolComponent. Sends out the complete tool of the selected tool*/
        emit('tool-select-component-event', selectedTool.tool);
        console.log(selectedTool.tool.name);
    }
</script>

<template>
    <!--display container for toollist-->
    <h2 class="toolListTitle">Tool List</h2>
    <div class="toolListContainer">
        <!-- display container for tool list element-->
        <div v-for="element in toolList" :key="element.id" class="toolListElement">
            <button :class="element.name === selectedTool.tool.name ? 'toolListButtonActive' : 'toolListButton'" @click="onToolClick(element)">
               <div class="toolListButtonContainer">
                    <img v-if="element != null" :src="element.texture" class="toolListImg"/>
                    <p v-if="element != null" class="toolListText">{{element.name}}</p>
               </div>
            </button>
        </div>
    </div>  
</template>

<style>
    /** style for list title in tool list */
    .toolListTitle{
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
    /** style for tool list in general*/
    .toolListContainer{
        margin-left: 5%;
        margin-right: 5%;
        list-style-type: none;
        display: inline-flex;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    /** style for list element in tool list*/
    .toolListElement {
        margin:0.5%;
    }
    /** style for images in tool list */
    .toolListImg {
        max-width: 5vh;
        max-height: 5vh;
    }
    /** style for text elements in tool list */
    .toolListText{
        color:white;
        margin-top: auto;
    }
    /** style for buttons in tool list */
    .toolListButton{
        border: solid 2px black;
        background-color:gray;
    }
    /** style for selected button in tool list */
    .toolListButtonActive{
        border: solid 2px black;
        background-color:orange;
    }
</style>