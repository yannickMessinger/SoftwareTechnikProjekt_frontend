<!--
List Item that represents single lobby and is embedded in LobbyList, displays Lobby Data Name, the current gaming mode the lobby is set to and the number of active players
    Displayed if lobby is in build mode, by clicking on button "Beitreten": Player joins clicked lobby.
-->

<template>
    <div class="cell">
        <table>
            <tr>
                <td style="width: 25%">{{ props.lobby.lobbyName }}</td>
                <td style="width: 15%">{{ props.lobby.lobbyModeEnum }}</td>
                <td style="width: 30%">
                    <button @click="selectLobby()" v-if="props.lobby.lobbyModeEnum !== E_LobbyMode.PLAY_MODE">
                        Beitreten
                    </button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup lang="ts">
import useUser from "../../services/User/UserStore"
import router from "../../router/router"
import { useLobbyList } from "../../services/Lobby/useLobbyList"
import { onMounted } from "vue"
import { E_LobbyMode } from "../../models/Lobby/E_LobbyMode"
import { ILobby } from "../../models/Lobby/ILobby"

const props = defineProps<{
    lobby: ILobby
}>()

const { setActiveLobby } = useUser()
const { receiveLobbyUpdates, joinMessage } = useLobbyList()
//const { updateActiveChatLobbyId } = useChat(name.value, )

//for later purposes to link to selected lobby via Vue Router
async function selectLobby() {
    //set ActiveLoppy property to the selected Lobby
    setActiveLobby(props.lobby)

    //fires JOINED event to backend to trigger persistence operations and inform other players on channel and update data
    joinMessage()
    router.push({
        path: "/lobbyview",
    })
}

onMounted(() => {
    //activate websockets connection to listen for incoming updates
    receiveLobbyUpdates()
})
</script>

<style scoped>
* {
    font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
}
* {
    font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
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
button:hover {
    background-color: var(--woe-blue-70);
}

.deleteButton {
    background: var(--woe-gray-50);
    border: none;
    border-radius: 8px;
    opacity: 1;
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
.deleteButton:hover {
    background-color: var(--woe-red-70);
}

td {
    padding-bottom: 20px;
    padding-left: 30px;
}
td {
    padding-bottom: 20px;
    padding-left: 30px;
}
</style>
