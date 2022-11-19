<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import ListBlocksComponent from './ListBlocksComponent.vue'
    import ListToolsComponent from './ListToolsComponent.vue'
    import SelectedBlockComponent from './SelectedBlockComponent.vue'
    import SelectedToolComponent from './SelectedToolComponent.vue';    
</script>

<template>
    <!-- table structure for display test-->
    <table class="tableTest">
        <tr>
            <td>
                <!--display tool List-->
                <ListToolsComponent></ListToolsComponent>  
            </td>
            <td>
                <!--display object List-->
                <ListBlocksComponent></ListBlocksComponent>
            </td>
            <td>
               <SelectedToolComponent></SelectedToolComponent> 
            </td>
            <td>
                <!--display container for active object-->
                <SelectedBlockComponent></SelectedBlockComponent>
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
</style>