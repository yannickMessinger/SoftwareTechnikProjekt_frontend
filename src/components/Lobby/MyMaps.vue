<template>
    <div class="headline">
        <h2>Meine Karten</h2>
    </div>
    <div class="mapsList">
        <table>
            <tbody>
                <MyMapsListItem :map="ele" v-for="ele in liste"></MyMapsListItem>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import MyMapsListItem from "./MyMapsListItem.vue"
import { IMyMapsListItem } from "../../typings/IMyMapsListitem"
import { useMyMaps } from "../../services/useMyMaps"

const props = defineProps<{
    liste: Readonly<IMyMapsListItem[]>
}>()

const { mapsList } = useMyMaps()
</script>

<style scoped>
table {
    /*border: 4px solid black;*/
    width: 100%;
    color: black;
}

th {
    height: 20px;
    text-align: left;
    background-color: white;
    display: fixed;
}

.headline {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: 10px;
}

.mapsList {
    height: 300px;
    display: flex;
    flex-direction: column;
    overflow: auto;
}
</style>
