<!-- Component that represents a list of active players in a selected lobby-->
<template>
    <div class="headline">
        <h2>Spieler</h2>
        <h3 v-if="playerListState.errormsg">{{ playerListState.errormsg }}</h3>
        <h4 v-else>Spieler Online: {{ props.liste.length }}</h4>
    </div>
    <div class="playerList">
        <table>
            <tbody>
                <PlayerListItem
                    :player="ele"
                    v-for="ele in liste"
                ></PlayerListItem>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
    import PlayerListItem from "./PlayerListItem.vue"
    import IUser from "../../typings/IUser"
    import { usePlayerList } from "../../services/usePlayerList"
    import { onMounted } from "vue"

    //PlayerList passed from backend
    const props = defineProps<{
        liste: Readonly<IUser[]>
    }>()

    const { playerListState, fetchPlayerList } = usePlayerList()

    onMounted(async () => {
        await fetchPlayerList
    })
</script>

<style scoped>
    th,
    td {
        padding: 1px;
        text-align: left;
    }

    table {
        width: 100%;
    }
    .playerList {
        height: 300px;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding-right: 30px;
    }

    .alignRight {
        text-align: right;
        font-weight: normal;
    }

    .head {
        display: flex;
        justify-content: space-between;
        border: 1px solid black;
    }

    .headline {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        margin-left: 30px;
        margin-right: 30px;
        margin-bottom: 10px;
    }
</style>
