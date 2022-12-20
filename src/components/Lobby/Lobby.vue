<!--List Item that represents single lobby and is embedded in LobbyList, displays Lobby Data Name, the current gaming mode the lobby is set to and the number of active players-->

<template>
    <div class="cell">
        <table>
            <tr>
                <td style="width: 25%">{{ props.lobby.lobbyName }}</td>
                <td style="width: 15%">{{ props.lobby.lobbyModeEnum }}</td>
                <td style="width: 30%">
                    <button @click="selectLobby()">Beitreten</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup lang="ts">
    import { ILobby } from "../../typings/ILobby"
    import BasicButton from "../Buttons/BasicButton.vue"
    import useUser from "../../services/UserStore"
    import router from "../../router/router"

    const props = defineProps<{
        lobby: ILobby
    }>()

    const { setActiveLobby } = useUser()

    //for later purposes to link to selected lobby via Vue Router
    async function selectLobby() {
        console.log(props.lobby.lobbyId, props.lobby.lobbyName)
        await setActiveLobby(props.lobby)
        console.log("user has active lobby")
        router.push({
            path: "/lobbyview",
        })
    }
</script>

<style scoped>
    * {
        font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto,
            "Helvetica Neue", sans-serif;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
    }

    button {
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 300;
        padding: 13px 23px;
        background-color: var(--woe-blue-60);
        color: white;
    }

    button:hover {
        background-color: var(--woe-blue-70);
    }

    .deleteButton {
        background: var(--woe-gray-50);
        border: none;
        border-radius: 8px;
        opacity: 1;
    }

    .deleteButton:hover {
        background-color: var(--woe-red-70);
    }

    td {
        padding-bottom: 20px;
        padding-left: 30px;
    }
</style>
