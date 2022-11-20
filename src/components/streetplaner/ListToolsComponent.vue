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
    var totalToolNumber = 3; /** number of toolslots shown in the toollist */
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
        
    function onToolClick(clickedTool:any){
        switch(clickedTool.id){
            case 0:
                createLogic();
            case 1:
                deleteLogic();
            case 2:
                editLogic();
        }
        console.log(selectedTool.tool.name);
        if(selectedTool.tool.id==clickedTool.id){
            selectedTool.tool = defaultTool;
        }else{
            selectedTool.tool = clickedTool;
        }
        emit('tool-select-event', selectedTool.tool.tool);
        emit('tool-select-component-event', selectedTool.tool);
        console.log(selectedTool.tool.name);
    }

    function createLogic(){
        /** add create logic here */
    }
    function deleteLogic(){
        /** add delete logic here */
    }
    function editLogic(){
        /** add edit logic here */
    }
</script>

<template>
    <!--display container for toollist-->
    <ul class="list-container">
        <h2 class="list-title">Tool List</h2>
        <!-- display container for tool list element-->
        <li v-for="element in toolList" :key="element.id" class="list-element">
            <button :class="element.name === selectedTool.tool.name ? 'listButtonActive' : 'listButton'" @click="onToolClick(element)">
                <img v-if="element != null" :src="element.texture" class="list-img"/>
                <h4 v-if="element != null" class="toolList-text">{{element.name}}</h4>
            </button>
        </li>
    </ul>  
</template>

<style>
    /** style for tool list in general*/
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
    /** style for list title in tool list */
    .list-title{
        margin: 5%;
        width: 90%;
        height: 90%;
        color:black;
        background-color: white;
    }
    /** style for list element in tool list*/
    .list-element {
        display: list-item;
        border: solid 1px gray;
        margin: 5%;
    }
    /** style for images in tool list */
    .list-img {
        width: 90%;
        height: 90%;
        display: block;
        border: solid 1px gray;
        margin: 5%;
    }
    /** style for text elements in tool list */
    .toolList-text{
        margin: 5%;
        width: 90%;
        height: 90%;
        color:black;
        border: solid 1px gray;
        background-color: white;
    }
    /** style for buttons in tool list */
    .listButton{
        border: solid 2px black;
        background-color:darkgray;
    }
    /** style for selected button in tool list */
    .listButtonActive{
        border: solid 2px black;
        background-color:orange;
    }
</style>