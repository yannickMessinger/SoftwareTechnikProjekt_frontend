<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive, watch, ref } from 'vue';
    import type { IBlockElement } from '../../services/streetplaner/IBlockElement';
    import useEventBus from '../../services/eventBus';
    /**Variables: */
    const pathToPictures = "/img/streetplaner/";
    const pathRotateButton = (pathToPictures+"tool-icons/rotate.png");
    /**currently selected object, default value is no object selected */
    var defaultBlock: IBlockElement = { 
        groupId: -1,
        group: "no data",
        id: -1,
        type:"no data",
        name:"no Block selected",
        rotation:0,
        texture: (pathToPictures+"no-data.png")
    };
    /** bus event */
    const { emit,bus } = useEventBus();
    /**  currently selected block */
    const selectedBlock = reactive({block: defaultBlock});
    const isDefault = ref(true);
    /** watch for selected block events to display selected block*/
    watch(() =>  bus.value.get('block-select-event'), (val) => {
        selectedBlock.block = val[0];
        if(selectedBlock.block.id==defaultBlock.id){
            isDefault.value = true;
        }else{
            isDefault.value = false;
        }
    });
    /** rotate event for clicking the rotate button in the details list to rotate the selected element */
    function onRotateClick(){
        if(!isDefault.value){
            selectedBlock.block.rotation = selectedBlock.block.rotation + 1;
            if(selectedBlock.block.rotation>3){
                selectedBlock.block.rotation = 0;
            }
            /** fires a block select event to mark a selected block change. Sends out this block*/
            emit("block-select-event", selectedBlock.block);
        }
    }
</script>

<template>
    <div class="selectedBlock">
        <h3 class="selectedBlockTitle"> Selected Block:</h3>
        <table>
            <tr>
                <td>
                    <img v-if="selectedBlock != null" :src="selectedBlock.block.texture" class="selectedBlockImg" :style="{ transform: 'rotate(' + selectedBlock.block.rotation * 90 + 'deg)' }"/>
                </td>
                <td>
                    <h4 class="selectedBlockDetailText">Details:</h4>
                    <ul class="selectedBlockDetails">
                        <li class="selectedBlockDetailText">{{selectedBlock.block.id}}</li>
                        <li class="selectedBlockDetailText">{{selectedBlock.block.name}}</li>
                        <li class="selectedBlockDetailText">{{selectedBlock.block.type}}</li>
                    </ul>
                    <button :disabled="isDefault" id="ListRotateButton" class="rotateButtonInDetails" @click="onRotateClick()">
                            <img v-if="selectedBlock != null" :src="pathRotateButton" id="ListRotateButtonImg" class="selectedBlockRotateImg" />
                    </button>
                </td>
            </tr>
        </table> 
    </div>
</template>

<style>
    /**style for the title in selected block */
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
    /** style for text in details list in selected block*/
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
    .selectedBlockRotateImg{
        width: 25%;
        height: 25%;
        border: solid 1px gray;
    }
    .rotateButtonInDetails{
        display:inline;
        border: solid 2px black;
        background-color: grey;
    }
</style>