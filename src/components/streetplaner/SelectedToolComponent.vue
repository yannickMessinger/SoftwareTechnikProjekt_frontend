<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive } from 'vue';
    import type { IToolElement } from '../../services/streetplaner/IToolElement';
    import { watch } from 'vue';
    import useEventBus from '../../services/eventBus';
    import ToolEnum from '../../services/streetplaner/ToolEnum';
    
    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    const { bus } = useEventBus();
    
    /** currently selected tool, default value is no tool selected */
    var defaultTool: IToolElement = {
        tool: ToolEnum.EMPTY,
        id: -1, 
        name: "no Tool selected",
        texture: (pathToPictures+"no-data.png")
    };
    const activeTool = reactive({tool: defaultTool});
    watch(() =>  bus.value.get('tool-select-component-event'), (val) => {
        activeTool.tool = val[0];
    });
    
</script>

<template>    
    <!--display container for active tool-->
    <div class="selected-object">
        <h3 class="toolList-text"> Active Tool:</h3>
        <img v-if="activeTool != null" :src="activeTool.tool.texture" class="list-img"/>
        <h4 v-if="activeTool != null" class="toolList-text">{{activeTool.tool.name}}</h4>
    </div>
</template>

<style>
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
    /** style for active tool and active object container*/
    .selected-object{
        display: table-row;
        border: solid 1px gray;
        background-color:darkgray;
        margin: 5%;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
</style>