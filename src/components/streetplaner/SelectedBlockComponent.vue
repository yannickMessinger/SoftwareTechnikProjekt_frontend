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
    /** bus event */
    const { bus } = useEventBus();
    /**  currently selected block */
    const selectedBlock = reactive({obj: defaultBlock});
    /** watch for selected block events to display selected block*/
    watch(() =>  bus.value.get('block-select-event'), (val) => {
        selectedBlock.obj = val[0];
    });
</script>

<template>
    <!--
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
        -->
    <p>
        <span id="header">Zelle</span>
    </p>
    <img v-if="selectedBlock != null" :src="selectedBlock.obj.texture" class="selectedBlockImg"/>
    <p>
        <span>ID</span>
        <span>{{selectedBlock.obj.id}}</span>
    </p>
    <p>
        <span>Name</span>
        <span>{{selectedBlock.obj.name}}</span>
    </p>
    <p>
        <span>Type</span>
        <span>{{selectedBlock.obj.type}}</span>
    </p>
</template>

<style scoped>
    *{
        --margin-bottom: 12px;
        
        font-size: 1em;
        margin: 0;
        color: var(--woe-black);
    }

    .selectedBlockImg{
        width: auto;
        height: auto;
        display: block;
        border: solid 2px var(--woe-blue-50);
        margin-bottom: var(--margin-bottom);
    }

    p{
        display: flex;
        justify-content: space-between;
        
    }

    #header{
        font-weight: bold;
        margin-bottom: var(--margin-bottom);
    }
</style>