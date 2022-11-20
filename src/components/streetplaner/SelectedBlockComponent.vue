<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive } from 'vue';
    import type { IBlockElement } from '../../services/streetplaner/IBlockElement';
    import { watch } from 'vue';
    import useEventBus from '../../services/eventBus';
      
    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    /**currently selected object, default value is no object selected */
    var defaultBlock: IBlockElement = { 
        groupId: -1,
        group: "no data",
        id: -1,
        type:"no data",
        name:"no Block selected",
        heading:0,
        texture: (pathToPictures+"no-data.png")
    };
    const { bus } = useEventBus();
    const selectedBlock = reactive({obj: defaultBlock});
    watch(() =>  bus.value.get('block-select-event'), (val) => {
        selectedBlock.obj = val[0];
    });

</script>

<template>
    <div class="selected-object">
        <h3 class="list-title"> Selected Block:</h3>
        <table>
            <tr>
                <td>
                    <img v-if="selectedBlock != null" :src="selectedBlock.obj.texture" class="list-img"/>
                </td>
                <td>
                    <ul class="list-without">
                        <li class="objectList-text"><h4>Details:</h4></li>
                        <li class="objectList-text">{{selectedBlock.obj.id}}</li>
                        <li class="objectList-text">{{selectedBlock.obj.name}}</li>
                        <li class="objectList-text">{{selectedBlock.obj.type}}</li>
                    </ul>
                </td>
            </tr>
        </table> 
    </div>
</template>

<style>
    /** style for images in selected block */
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
    /** style for text in list elements in block list*/
    .objectList-text{
        color:black;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
    /** style for selected block container*/
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