<template>
    <div class="popup">
        <div class="content">
            <div class="flex-items">
                <slot />
            </div>
            <div class="flex-items">
                <label for="map_name"> <b>Karte-Name: </b></label>
                <input type="text" name="map_name" v-model="mapNameInput" placeholder="Kartenname eingeben" />
            </div>
            <div class="flex-items">
                <!--<button class="green">Karte hinzufügen</button>-->
                <BasicButton
                    class="sec btn blue"
                    display="Karte hinzufuegen"
                    :btn_click="
                        () => {
                            createNewMap(id, mapNameInput), TogglePopup()
                        }
                    "
                ></BasicButton>

                <!--<BasicButton class="sec btn blue" display="SSchließen" :btn_click="TogglePopup()"></BasicButton>-->
                <button @click="TogglePopup()">schließen</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue"

const mapNameInput = ref("")
export default {
    props: ["TogglePopup"],
}
</script>

<script setup lang="ts">
import { createNewMap } from "../../services/Lobby/useMyMaps"
import BasicButton from "../Buttons/BasicButton.vue"
import useUser from "../../services/User/UserStore"
import watch from "vue"

const { userId } = useUser()

const id = userId.value === undefined ? -1 : userId.value

//var userID = ref(-1)
/*if(userId!=undefined){
    userID = userId.value
}else {
    userID = -1
}*/
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);

    display: flex;

    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
}

.content {
    background: #fff;
    padding: 32px;
    border-radius: 8px;
}

/*
.flex-items:nth-child(1) {
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

.flex-items:nth-child(2) {
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

.flex-items:nth-child(3) {
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}
*/

button {
    font-size: 16px;
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

input {
    width: auto;
    height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--woe-gray-40);
    border-radius: 5px;
}

.green {
    background-color: var(--woe-green-60);
}

.green:hover {
    background-color: var(--woe-green-70);
}
</style>
