<template>
    <div id="ownCardsContainer">
        <div class="headline">
            <h2>Meine Karten</h2>
        </div>
        <div class="container" id="cardListContainer">
            <table id="cardList" class="cardBasic">
                <tr>
                    <th>
                        <h6>Kartenname</h6>
                    </th>
                    <th>
                        <h6>Erstelldatum</h6>
                    </th>
                    <th>
                        <h6>Lobby starten</h6>
                    </th>
                    <th>
                        <h6>Karte loeschen</h6>
                    </th>
                </tr>
                <tr v-for="card in cardList" track-by="id" v-if="!isEmpty" id="cardListItem">
                    <td v-if="card !== null">
                        <p class="textfield" id="CardNameTag">
                            {{ card.name }}
                        </p>
                    </td>
                    <td v-if="card !== null">
                        <p class="textfield" id="CardDateTag">
                            {{ card.date.getDate() }}/{{ card.date.getMonth() + 1 }}/{{ card.date.getFullYear() }}
                        </p>
                    </td>
                    <td v-if="card !== null">
                        <div v-if="activeLobby.lobbyId === -1">
                            <button id="startLobbyButton" @click="createLobbyAction(card)">Lobby erstellen</button>
                        </div>
                        <div v-else>
                            <p v-if="card.id == activeLobby.mapId" class="greenButtonLabel">aktuelle Karte</p>
                            <button v-else id="startLobbyButton" @click="changeMapAction(card)">
                                zu Karte wechseln
                            </button>
                        </div>
                    </td>
                    <td v-if="card !== null">
                        <button
                            :disabled="card.id == activeLobby.mapId"
                            class="deleteButton"
                            id="deleteCardButton"
                            @click="cardClickedDeleteAction(card)"
                        >
                            X
                        </button>
                    </td>
                </tr>
                <tr v-if="isEmpty" id="emptyListRow">
                    <td>
                        <p class="textfield">keine Karten vorhanden</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <button id="startLobbyButton" @click="() => TogglePopup()">Karte hinzufuegen</button>
                        <AddMapPopup v-if="popupTrigger" :TogglePopup="() => TogglePopup()">
                            <h2>Karte hinzufuegen</h2>
                        </AddMapPopup>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
//import { IMyMapsListItem } from "../../typings/IMyMapsListitem"
//import { useMyMaps } from "../../services/useMyMaps"
import AddMapPopup from "./AddMapPopup.vue"
/** Imports: */
import { reactive, watch, ref, defineEmits } from "vue"
import type { ICardElement } from "../../services/Lobby/ICardElement"
import useEventBus from "../../services/eventBus"
import router from "../../router/router"
import useUser from "../../services/UserStore"
import { IMapDTO } from "../../typings/IMapDTO"
import { IMyMapsState } from "../../typings/IMyMapsState"
import { IGetMapsByPlayerResponseDTO } from "../../typings/IGetMapsByPlayerResponseDTO"

const props = defineProps<{
    liste: Readonly<IMapDTO[]>
    popupTrigger: Boolean
}>()

const mapsState = reactive<IMyMapsState>({
    mapslist: Array<IMapDTO>(),
    errormsg: "",
})

/** Variablen: */
const { user, userId, hostId, activeLobby, setActiveLobby } = useUser()
const isEmpty = ref(true)
const numberOfOwnedCards = ref(0)
const cardList: ICardElement[] = reactive(Array(numberOfOwnedCards.value).fill(null))

const popupTrigger = ref(false)

const TogglePopup = () => {
    popupTrigger.value = !popupTrigger.value
}

/**Card List Data Import from Backend or load default list */
getMapsFromBackend()

/** button functions: */
function createLobbyAction(clickedCard: ICardElement) {
    console.log("clicked")
    activeLobby.value.mapId = clickedCard.id
    console.log(activeLobby.value.mapId)
    router.push("/create")
}
function changeMapAction(clickedCard: ICardElement) {
    console.log("Pl-List")
    console.log(activeLobby.value.playerList)
    activeLobby.value.mapId = clickedCard.id
}

/** delete button*/
function cardClickedDeleteAction(clickedCard: any) {
    var removedIndex = cardList.findIndex((cardElement) => cardElement.id == clickedCard.id)
    var removedCard = null
    switch (removedIndex) {
        case 0:
            /*delete list head (shift)*/
            removedCard = cardList.shift()
            break
        case -1:
            console.warn("-1: Deleted Item not found")
            break
        default:
            /* delete list element (splice) */
            removedCard = cardList.splice(removedIndex, removedIndex)
    }
    if (cardList.length == 0) {
        isEmpty.value = true
    }
    if (removedCard != null) {
        console.log("Removed Item: " + clickedCard.id)
        // TODO call delete option in Backend (#229 connect backend)
    }
}

async function getMapsFromBackend() {
    console.log("search maps")
    const url = "api/map"

    try {
        const response = await fetch(url, {
            method: "GET",
        })

        if (!response.ok) {
            mapsState.errormsg = response.statusText
            mapsState.mapslist = []
            console.log("error in fetching maplist")
            throw new Error(response.statusText)
        }

        const jsondata: IGetMapsByPlayerResponseDTO[] = await response.json()
        jsondata.forEach(function (value) {
            console.log("loop: " + value.mapId)
            cardList.push({ id: value.mapId, name: value.mapName, date: new Date(value.creationDate) })
            console.log(cardList)
        })
        //mapsState.mapslist = jsondata
        mapsState.errormsg = ""
    } catch (error) {
        console.log("error in updateMapsList")
    }
    if (cardList.length > 0) {
        isEmpty.value = false
    }
}
</script>

<style scoped>
/** 
    * {
        font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto,
            "Helvetica Neue", sans-serif;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        }
    */
table,
tr {
    margin: auto;
    border: 1px solid black;
    border-collapse: collapse;
    color: black;
}

th {
    padding: 2%;
    text-align: center;
    background-color: white;
}

tr {
    padding: 2%;
}

td {
    padding: 2%;
    text-align: center;
}

.headline {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: 10px;
}

button {
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    padding: 13px 23px;
    background-color: var(--woe-blue-60);
    color: white;
}

button:hover {
    background-color: var(--woe-blue-70);
}

.deleteButton {
    background: var(--woe-red-50);
    border: none;
    border-radius: 8px;
    opacity: 1;
}

.deleteButton:hover {
    background-color: var(--woe-red-70);
}

.greenButton {
    background-color: var(--woe-green-60);
}

.greenButtonLabel {
    background-color: var(--woe-green-60);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 90%;
    padding: 5px 23px;
    color: white;
}

.greenButton:hover {
    background-color: var(--woe-green-70);
}

.textfield {
    font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
}

.mapsList {
    height: 300px;
    display: flex;
    flex-direction: column;
    overflow: auto;
}
.container {
    padding: 5%;
}
</style>
