<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive } from 'vue';
    import type { IListElement } from '../../services/streetplaner/IListElement';
    import type { IToolElement } from '../../services/streetplaner/IToolElement';
    
    import CreateObjectList from './CreateObjectList.vue'
    import ToolList from './ToolList.vue'

    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    
    /** currently selected tool, default value is no tool selected */
    var defaultTool: IToolElement = {
        id: -1, 
        name: "no Tool selected",
        texture: (pathToPictures+"no-data.png")
    };
    /**currently selected object, default value is no object selected */
    var defaultObject: IListElement = { 
        groupId: -1,
        group: "no data",
        id: -1,
        type:"no data",
        name:"no Object selected",
        heading:0,
        texture: (pathToPictures+"no-data.png")
    };
    const activeTool = reactive({tool: defaultTool});
    const activeObject = reactive({obj: defaultObject});
    
</script>

<template>
    <!-- table structure for display test-->
    <table class="tableTest">
        <tr>
            <td>
                <!--display tool List-->
                <ToolList></ToolList>  
            </td>
            <td>
                <!--display object List-->
                <CreateObjectList></CreateObjectList>
            </td>
            <td>
                <!--display container for active tool-->
                <div class="selected-object">
                    <h3 class="list-title"> Active Tool:</h3>
                    <img v-if="activeTool != null" :src="activeTool.tool.texture" class="list-img"/>
                    <h4 v-if="activeTool != null" class="toolList-text">{{activeTool.tool.name}}</h4>
                </div>
            </td>
            <td>
                <!--display container for active object-->
                <div class="selected-object">
                    <h3 class="list-title"> Active Object:</h3>
                    <table>
                        <tr>
                            <td>
                                <img v-if="activeObject != null" :src="activeObject.obj.texture" class="list-img"/>
                            </td>
                            <td>
                                <ul class="list-without">
                                    <li class="objectList-text"><h4>Details:</h4></li>
                                    <li class="objectList-text">{{activeObject.obj.id}}</li>
                                    <li class="objectList-text">{{activeObject.obj.name}}</li>
                                    <li class="objectList-text">{{activeObject.obj.type}}</li>
                                </ul>
                            </td>
                        </tr>
                    </table> 
                </div>
            </td>
        </tr>
    </table>
</template>

<style>
    /** style for test table*/
    .tableTest{
        width: 100%;
        height: 100%;
        display: inline-table;
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
    /** style for text in listelements in object lists*/
    .objectList-text{
        color:black;
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