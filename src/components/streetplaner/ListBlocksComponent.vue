<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive } from 'vue';
    import type { IListElement } from '../../services/streetplaner/IListElement';
    
    import useEventBus from '../../services/eventBus';

    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    var totalObjectNumber = 3; /** number of objectslots shown in the objectList*/
    var objectList: IListElement[] = Array(totalObjectNumber).fill([]); /** List of all Objects placable in street Editor*/
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
    const activeObject = reactive({obj: defaultObject});
    
    /**entrys in objectlist */
    objectList[0] = { groupId: 0,group: "Testobject1",id: 0,type:"???",name:"straight",heading:0,texture: (pathToPictures+"object-icons/straight.png")};
    objectList[1] = { groupId: 0,group: "Testobject1",id: 1,type:"???",name:"curve",heading:0,texture: (pathToPictures+"object-icons/curve.png")};
    objectList[2] = { groupId: 1,group: "Testobject2",id: 2,type:"???",name:"cross",heading:0,texture: (pathToPictures+"object-icons/cross.png")};

    
    const {emit}=useEventBus();

    function onCreateObjectClick(row:any){
        console.log(activeObject.obj.name);
        if(activeObject.obj.id==row.id){
            activeObject.obj = defaultObject;
        }else{
            activeObject.obj = row;
        }
        emit("block-select-event", activeObject.obj);
        console.log(activeObject.obj.name);
    }
</script>

<template>
    <!--display container for object List-->
    <div class="list-container">
        <h2 class="list-title">Object List</h2>
        <!-- display container for object list element-->
        <div v-for="element in objectList" class="list-element">
            <button :class="element.name === activeObject.obj.name ? 'listButtonActive' : 'listButton'" @click="onCreateObjectClick(element)">      
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
</template>

<style>
    /** style for object list in general*/
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
    /** style for list title in objectlist*/
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
    /** style for images in list-Element*/
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
    /** style for text in listelements in object lists*/
    .objectList-text{
        color:black;
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