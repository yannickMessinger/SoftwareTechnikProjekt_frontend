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
    const {emit,bus} = useEventBus();
    var defaultCard: ICardElement = {id:-1, name: "Keine Eintraege", date:new Date('1970-06-07') };
    const selectedCard = reactive({card: defaultCard})
    const isEmpty = ref(true);
    const numberOfOwnedCards = ref(0);
</script>

<template>
    <div id = "ownCardsContainer">
        <div id ="titleContainer">
            <h2 id = "ownCardsTitle">Meine Karten</h2>
        </div>
        <div id = "cardListContainer">
            <ul id = "cardList">
                <li id = "cardListItem">
                    <div id = "CardListItemContainer">
                        <p id ="CardNameTag">Name (platzhalter)</p> <!-- laenge beschränken?-->
                        <p id ="CardDateTag"></p>
                        <button id="startLobbyButton">Lobby erstellen</button>
                        <button id="deleteCardButton"> X </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style>
</style>

