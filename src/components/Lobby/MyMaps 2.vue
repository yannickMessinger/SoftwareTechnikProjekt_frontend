<template>
    <!--div class="headline">
        <h2>Meine Karten</h2>
    </div>
    <div class="mapsList">
        <table>
            <tbody>
                <MyMapsListItem
                    :map="ele"
                    v-for="ele in liste"
                ></MyMapsListItem>
            </tbody>
        </table>
    </div -->

    <div id="ownCardsContainer">
        <div class="headline">
            <h2>Meine Karten</h2>
        </div>
        <div id="cardListContainer">
            <table id="cardList" class="cardBasic">
                <tr>
                    <th>
                        <h6 class="headline">Kartenname</h6>
                    </th>
                    <th>
                        <h6 class="headline">Erstelldatum</h6>
                    </th>
                    <th>
                        <h6 class="headline">Lobby starten</h6>
                    </th>
                    <th>
                        <h6 class="headline">Karte loeschen</h6>
                    </th>
                </tr>
                <tr v-for="card in cardList" track-by="id" v-if="!isEmpty" id="cardListItem">
                    <td v-if="card !== null">
                        <p class="textfield" id="CardNameTag">
                            {{ card.name }}
                        </p>
                        <!-- laenge beschränken?-->
                    </td>
                    <td v-if="card !== null">
                        <p class="textfield" id="CardDateTag">
                            {{ card.date.getDate() }}/{{ card.date.getMonth() + 1 }}/{{ card.date.getFullYear() }}
                        </p>
                    </td>
                    <td v-if="card !== null">
                        <button v-if="!isLobbyOpen" id="startLobbyButton" @click="cardClickedLobbyAction(card)">
                            Lobby starten
                        </button>
                        <button
                            :disabled="!isHost"
                            v-if="isLobbyOpen && !(card.id == selectedCard.card.id)"
                            id="startLobbyButton"
                            @click="cardClickedLobbyAction(card)"
                        >
                            Karte wechseln
                        </button>
                        <button
                            :disabled="!isHost"
                            v-if="isLobbyOpen && card.id == selectedCard.card.id"
                            id="startLobbyButton"
                            @click="cardClickedLobbyAction(card)"
                        >
                            Lobby schließen
                        </button>
                    </td>
                    <td v-if="card !== null">
                        <button class="deleteButton" id="deleteCardButton" @click="cardClickedDeleteAction(card)">
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
                    <td>
                        <button @click="TogglePopup">Karte hinzufügen</button>
                        <AddMapPopup v-if="buttonTrigger">
                            <h2>Karte hinzufügen</h2>
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

/** Variablen: */
/** bus event */
var backendOfflineDebugMode = true
const { emit, bus } = useEventBus()
var defaultCard: ICardElement = {
    id: -1,
    name: "Keine Eintraege",
    date: new Date("1997-06-07"),
}
const selectedCard = reactive({ card: defaultCard })
const isEmpty = ref(true)
const isLobbyOpen = ref(false)
const isHost = ref(false)
const numberOfOwnedCards = ref(0)
const cardList: ICardElement[] = reactive(Array(numberOfOwnedCards.value).fill(null))

const buttonTrigger = ref(false)

function TogglePopup() {
    if (buttonTrigger.value) {
        buttonTrigger.value = false
    } else {
        buttonTrigger.value = true
    }
}

/**Card List Data Import from Backend or load default list */
if (backendOfflineDebugMode) {
    /**TODO Remove Debug Components */
    console.warn("Unable to reach Backend Server, insert default Maps")
    cardList[0] = { id: 0, name: "Testmap 1", date: new Date("1997-06-07") }
    cardList[1] = { id: 1, name: "Testmap 2", date: new Date("1997-06-07") }
    cardList[2] = { id: 2, name: "Testmap 3", date: new Date("1997-06-07") }
    isEmpty.value = false
} else {
    //TODO import list data from backend here (#229 connect backend)
}
//TODO Compile imported data into card Elements (#229 connect backend, #42 need card informations)

watch(
    () => bus.value.get("lobby-closed-event"),
    (val) => {
        if (isLobbyOpen.value) {
            isLobbyOpen.value = false
        }
        if (isHost.value) {
            isHost.value = false
        }
        selectedCard.card = defaultCard
        /** backend communication from event emit?*/
    }
)

watch(
    () => bus.value.get("card-saved-event"),
    (val) => {
        selectedCard.card = val
        var changedIndex = cardList.findIndex((cardElement) => cardElement.id == val.id)
        cardList[changedIndex] = val
        /** backend communication from event emit?*/
    }
)

/** button functions: */
/** Lobby action button*/
function cardClickedLobbyAction(clickedCard: any) {
    if (clickedCard.id == selectedCard.card.id) {
        selectedCard.card = defaultCard
        isHost.value = false
        isLobbyOpen.value = false
    } else {
        if (!isLobbyOpen.value) {
            selectedCard.card = clickedCard
            isHost.value = true
            isLobbyOpen.value = true
            router.push("/create")
        } else {
            selectedCard.card = clickedCard
        }
        //TODO control if watcher can handle the change at all time, otherwise prevent the player from changing
        emit("card-load-event", selectedCard.card)
        //TODO inform backend that active map changed (#229 connect backend)
    }
}

/** delete button*/
function cardClickedDeleteAction(clickedCard: any) {
    if (clickedCard.id == selectedCard.card.id) {
        /*TODO What if deleted card is active card? (#228) */
    } else {
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
        if (!backendOfflineDebugMode) {
            if (removedCard != null) {
                console.log("Removed Item: " + clickedCard.id)
                // TODO call delete option in Backend (#229 connect backend)
            }
        }
    }
}

function addNewCardClickAction() {
    //TODO Add call popup here #282 und console.log entfernen
    console.log("Karte hinzufuegen geklickt, popup fehlt noch")
}

/**
const props = defineProps<{
    liste: Readonly<IMyMapsListItem[]>
}>()

const { mapsList } = useMyMaps()

*/
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

td {
    padding-bottom: 20px;
    padding-left: 30px;
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
    background: var(--woe-gray-50);
    border: none;
    border-radius: 8px;
    opacity: 1;
}

.deleteButton:hover {
    background-color: var(--woe-red-70);
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
</style>
