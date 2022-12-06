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
    var numberOfMaxCards = 15;
    const cardList: ICardElement[] = reactive(Array(numberOfOwnedCards.value).fill(null));
    console.log("Cards:");
    console.log(cardList.length);
    if(backendOfflineDebugMode){ /**TODO Remove Debug Components */
        cardList[0] = {id:0, name:"abcd", date:new Date('2000-12-12')}
        cardList[1] = {id:1, name:"ergh", date:new Date('2000-12-12')} 
        cardList[2] = {id:2, name:"ijkl", date:new Date('2000-12-12')}
        numberOfOwnedCards.value = 1;
        console.log(cardList.length);
        //var removed = cardList.splice(1,1);
        console.log(cardList.length);
        //console.log(removed);

    }else{
        // import list data from backend here
    }

    function addNewCardClickAction(){
        //Feature Request? 
    }

    function cardClickedLobbyAction(clickedCard:any){
        if(!isLobbyOpen){
            selectedCard.card = clickedCard
        }
    }

    function cardClickedDeleteAction(clickedCard:any){
        // What if deleted card is active card?
        if(clickedCard.id==selectedCard.card.id){
            //TODO
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
            if(!backendOfflineDebugMode){
                // TODO Add Backend delete here!
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
                <tr v-for="card in cardList" track-by="id" id = "cardListItem">
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
            </table>
        </div>
    </div>
</template>

<style>
.cardBasic{
    color: black;
}
</style>

