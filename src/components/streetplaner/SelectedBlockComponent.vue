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
    <div class="selectedBlock">
        <h3 class="selectedBlockTitle"> Selected Block:</h3>
        <table>
            <tr>
                <td>
                    <img v-if="selectedBlock != null" :src="selectedBlock.obj.texture" class="selectedBlockImg"/>
                </td>
                <td>
                    <ul class="selectedBlockDetails">
                        <li class="selectedBlockDetailText"><h4>Details:</h4></li>
                        <li class="selectedBlockDetailText">{{selectedBlock.obj.id}}</li>
                        <li class="selectedBlockDetailText">{{selectedBlock.obj.name}}</li>
                        <li class="selectedBlockDetailText">{{selectedBlock.obj.type}}</li>
                    </ul>
                </td>
            </tr>
        </table> 
    </div>
</template>

<style>
    .selectedBlockTitle{
        color:black;
        background-color: white;
        text-align: center;
        margin:5%;
    }
    /** style for images in selected block */
    .selectedBlockImg{
        width: 100%;
        height: 100%;
        display: block;
        border: solid 1px gray;

    }
    /** style for text in list elements in block list*/
    .selectedBlockDetailText{
        color:black;
    }
    /** style for selected block container*/
    .selectedBlock{
        display: table-row;
        border: solid 1px gray;
        background-color:darkgray;
        padding: 5px;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
</style>