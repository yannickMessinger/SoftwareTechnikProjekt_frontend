<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import type { IListElement } from '../../services/streetplaner/IListElement';
    import type { IToolElement } from '../../services/streetplaner/IToolElement';
    
    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    var totalToolNumber = 3; /** number of toolslots shown in the toollist*/
    var toolList: IToolElement[] = Array(totalToolNumber).fill([]); /** List of all Tools */
    var totalObjectNumber = 3; /** number of objectslots shown in the objectList*/
    var objectList: IListElement[] = Array(totalObjectNumber).fill([]); /** List of all Objects placable in street Editor*/
    /** currently selected tool, default value is no tool selected */
    var activeTool: IToolElement = {
        id: -1, 
        name: "no Tool selected",
        texture: (pathToPictures+"no-data.png")
    };
    /**currently selected object, default value is no object selected */
    var activeObject: IListElement = { 
        groupId: -1,
        group: "no data",
        id: -1,
        type:"no data",
        name:"no Object selected",
        heading:0,
        texture: (pathToPictures+"no-data.png")
    };
    
    /**entrys in toollist */ 
    toolList[0] = { id: 0, name: "create", texture: (pathToPictures+"tool-icons/create.png")};
    toolList[1] = { id: 1, name: "delete", texture: (pathToPictures+"tool-icons/delete.png")};
    toolList[2] = { id: 2, name: "edit", texture: (pathToPictures+"tool-icons/edit.png")};
    
    /**entrys in objectlist */
    objectList[0] = { groupId: 0,group: "Testobject1",id: 0,type:"???",name:"straight",heading:0,texture: (pathToPictures+"object-icons/straight.png")};
    objectList[1] = { groupId: 0,group: "Testobject1",id: 1,type:"???",name:"curve",heading:0,texture: (pathToPictures+"object-icons/curve.png")};
    objectList[2] = { groupId: 1,group: "Testobject2",id: 2,type:"???",name:"cross",heading:0,texture: (pathToPictures+"object-icons/cross.png")};
    
    function onClick(row:any){
        console.log(activeTool.name);
        if(activeTool!=row){
            activeTool = row;
        }else{
            activeTool = {
                id: -1, 
                name: "no Tool selected",
                texture: (pathToPictures+"no-data.png")
            };
        }
        console.log(row.id);
        console.log(activeTool.name);
    }

</script>

<template>
    <!-- table structure for display test-->
    <table class="tableTest">
        <tr>
            <td>
                <!--display container for toollist-->
                <ul class="list-container">
                    <h2 class="list-title">Tool List</h2>
                    <!-- display container for tool list element-->
                    <li v-for="element in toolList" :key="element.id" class="list-element">
                        <button id="test" class="list-button" @click="onClick(element)">
                            <img v-if="element != null" :src="element.texture" class="list-img"/>
                            <h4 v-if="element != null" class="toolList-text">{{element.name}}</h4>
                        </button>
                    </li>
                </ul>  
            </td>
            <td>
                <!--display container for object List-->
                <div class="list-container">
                    <h2 class="list-title">Object List</h2>
                    <!-- display container for object list element-->
                    <div v-for="element in objectList" class="list-element">
                        <button class="list-button">
                            <table>
                                <tr>
                                    <td>
                                        <img v-if="element != null" :src="element.texture" class="list-img"/>
                                    </td>
                                    <td>
                                        <ul class="list-without">
                                            <li class="objectList-text"><h4>Details:</h4></li>
                                            <li class="objectList-text">{{element.id}}</li>
                                            <li class="objectList-text">{{element.name}}</li>
                                            <li class="objectList-text">{{element.type}}</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </button> 
                    </div>
                </div>
            </td>
            <td>
                <!--display container for active tool-->
                <div class="selected-object">
                    <h3 class="list-title"> Active Tool:</h3>
                    <img v-if="activeTool != null" :src="activeTool.texture" class="list-img"/>
                    <h4 v-if="activeTool != null" class="toolList-text">{{activeTool.name}}</h4>
                </div>
            </td>
            <td>
                <!--display container for active object-->
                <div class="selected-object">
                    <h3 class="list-title"> Active Object:</h3>
                    <table>
                        <tr>
                            <td>
                                <img v-if="activeObject != null" :src="activeObject.texture" class="list-img"/>
                            </td>
                            <td>
                                <ul class="list-without">
                                    <li class="objectList-text"><h4>Details:</h4></li>
                                    <li class="objectList-text">{{activeObject.id}}</li>
                                    <li class="objectList-text">{{activeObject.name}}</li>
                                    <li class="objectList-text">{{activeObject.type}}</li>
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
    /** style for buttons (tool list and object list) */
    .list-button{
        border: solid 2px black;
        background-color:darkgray;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    .list-button{
        border: solid 2px black;
        background-color:darkgray;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    /** style for clicked buttons (tool list and object list) */
    .list-button:focus{
        background-color: orange;
    }
    /** list without bullets for object sub list on button*/
    .list-without {
        list-style-type: none;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }


</style>