<!--
    author: Sean Dittmann
    date: 01.12.2022 
-->

<script setup lang="ts">
    /** Imports: */
    import { reactive, watch, ref } from 'vue';
    import type { ICardElement } from '../../../services/mainpage/ICardElement';
    import useEventBus from '../../../services/eventBus';

    /** Variablen: */
    /** bus event */
    var backendOfflineDebugMode = true;
    const {emit,bus} = useEventBus();
    var defaultCard: ICardElement = {id:-1, name: "Keine Eintraege", date:new Date('1997-06-07') };
    const selectedCard = reactive({card: defaultCard})
    const isEmpty = ref(true);
    const isLobbyOpen = ref(false);
    const numberOfOwnedCards = ref(0);
    const cardList: ICardElement[] = reactive(Array(numberOfOwnedCards.value).fill(null));
    
    /**Card List Data Import from Backend or load default list */
    console.log("Cards:");
    if(backendOfflineDebugMode){ /**TODO Remove Debug Components */
        cardList[0] = {id:0, name:"abcd", date:new Date('2000-12-12')};
        cardList[1] = {id:1, name:"ergh", date:new Date('2000-12-12')}; 
        cardList[2] = {id:2, name:"ijkl", date:new Date('2000-12-12')};
        isEmpty.value = false;
    }else{
        //TODO import list data from backend here (#229 connect backend)
    }
    //TODO Compile imported data into card Elements (#229 connect backend)
    console.log(cardList.length);

    function addNewCardClickAction(){
        //Feature Request (#227 add new map button)
    }

    function cardClickedLobbyAction(clickedCard:any){
        if(!isLobbyOpen){
            selectedCard.card = clickedCard
        }
    }

    function cardClickedDeleteAction(clickedCard:any){
        if(clickedCard.id==selectedCard.card.id){
            /*TODO What if deleted card is active card? (#228) */ 
        }else{
            console.log("Delete Action");
            console.log("List-old:");
            console.log(cardList.length);
            var removedIndex = cardList.findIndex(cardElement => cardElement.id==clickedCard.id);
            console.log("removedIndex: "+removedIndex);
            var removedCard = null;
            switch(removedIndex){
                case 0:
                    console.log("delete list head (shift)");
                    removedCard = cardList.shift();
                    break;
                case -1:
                    console.warn("-1: Deleted Item not found");
                    break;
                default:
                    console.log("delete list element (splice)");
                    removedCard = cardList.splice(removedIndex,removedIndex);
            }
            console.log("List-new:");
            console.log(cardList.length);
            if(cardList.length==0){
                isEmpty.value = true;
            }
            if(!backendOfflineDebugMode){
                // TODO call delete option in Backend (#229 connect backend)
            }
        }
    }

</script>

<template>
    <div id = "ownCardsContainer">
        <div id ="titleContainer">
            <h2 id = "ownCardsTitle" class="cardBasic">Meine Karten</h2>
        </div>
        <div id = "cardListContainer">
            <table id = "cardList" class="cardBasic">
                <tr>
                    <th>
                        <h6>Kartenname</h6>
                    </th>
                    <th>
                        <h6>Erstelldatum</h6>
                    </th>
                    <th>
                        <h6>Karte starten</h6>
                    </th>
                    <th>
                        <h6>Karte loeschen</h6>
                    </th>
                </tr>
                <tr v-for="card in cardList" track-by="id" v-if="!isEmpty" id = "cardListItem">
                    <td v-if="card !== null">
                        <p id ="CardNameTag">{{card.name}}</p> <!-- laenge beschränken?-->
                    </td>
                    <td v-if="card !== null">
                        <p id ="CardDateTag">{{card.date.getDate()}}/{{(card.date.getMonth()+1)}}/{{card.date.getFullYear()}}</p>    
                    </td>
                    <td v-if="card !== null">
                        <button id="startLobbyButton">Lobby erstellen</button>    
                    </td>
                    <td v-if="card !== null">
                        <button id="deleteCardButton" @click="cardClickedDeleteAction(card)"> X </button>
                    </td>
                </tr>
                <tr v-if="isEmpty" id = "emptyListRow">
                    <td>
                        <p>keine Karten vorhanden</p>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style>
.cardBasic{
    color: black;
}
</style>

