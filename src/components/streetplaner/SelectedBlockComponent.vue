<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive } from 'vue';
    import type { IListElement } from '../../services/streetplaner/IListElement';
    import { watch } from 'vue';
    import useEventBus from '../../services/eventBus';
      
    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
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
    const { bus } = useEventBus();
    const activeObject = reactive({obj: defaultObject});
    watch(() =>  bus.value.get('block-select-event'), (val) => {
        activeObject.obj = val[0];
    });

</script>

<template>
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