<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive } from 'vue';
    import type { IToolElement } from '../../services/streetplaner/IToolElement';
    
    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    var totalToolNumber = 3; /** number of toolslots shown in the toollist*/
    var toolList: IToolElement[] = Array(totalToolNumber).fill([]); /** List of all Tools */
    /** currently selected tool, default value is no tool selected */
    var defaultTool: IToolElement = {
        id: -1, 
        name: "no Tool selected",
        texture: (pathToPictures+"no-data.png")
    };
    const activeTool = reactive({tool: defaultTool});
    
    /**entrys in toollist */ 
    toolList[0] = { id: 0, name: "create", texture: (pathToPictures+"tool-icons/create.png")};
    toolList[1] = { id: 1, name: "delete", texture: (pathToPictures+"tool-icons/delete.png")};
    toolList[2] = { id: 2, name: "edit", texture: (pathToPictures+"tool-icons/edit.png")};
        
    function onToolClick(row:any){
        switch(row.id){
            case 0:
                createLogic();
            case 1:
                deleteLogic();
            case 2:
                editLogic();
        }
        console.log(activeTool.tool.name);
        if(activeTool.tool.id==row.id){
            activeTool.tool = defaultTool;
        }else{
            activeTool.tool = row;
        }
        console.log(activeTool.tool.name);
    }

    function createLogic(){
        /**add create logic here */
    }
    function deleteLogic(){
        /**add delete logic here */
    }
    function editLogic(){
        /**add edit logic here */
    }
</script>

<template>
    <!--display container for toollist-->
    <ul class="list-container">
        <h2 class="list-title">Tool List</h2>
        <!-- display container for tool list element-->
        <li v-for="element in toolList" :key="element.id" class="list-element">
            <button :class="element.name === activeTool.tool.name ? 'listButtonActive' : 'listButton'" @click="onToolClick(element)">
                <img v-if="element != null" :src="element.texture" class="list-img"/>
                <h4 v-if="element != null" class="toolList-text">{{element.name}}</h4>
            </button>
        </li>
    </ul>  
</template>

<style>
    /** style for tool list or object list in general*/
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
    /** style for list title for toollist and objectlist*/
    .list-title{
        margin: 5%;
        width: 90%;
        height: 90%;
        color:black;
        background-color: white;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    /** style for list element for toollist and objectlist*/
    .list-element {
        display: list-item;
        border: solid 1px gray;
        margin: 5%;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    /** style for images in toollist, objectlist, active tool and active object*/
    .list-img {
        width: 90%;
        height: 90%;
        display: block;
        border: solid 1px gray;
        margin: 5%;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none; 
    }
    /** style for text elements in toollist and active tool*/
    .toolList-text{
        margin: 5%;
        width: 90%;
        height: 90%;
        color:black;
        border: solid 1px gray;
        background-color: white;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    /** style for buttons (tool list and object list) */
    .listButton{
        border: solid 2px black;
        background-color:darkgray;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    /** style for clicked buttons (tool list and object list) */
    .listButtonActive{
        border: solid 2px black;
        background-color:red;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
</style>