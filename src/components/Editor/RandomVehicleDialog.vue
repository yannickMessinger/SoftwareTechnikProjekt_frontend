<script setup lang="ts">
// imports
import { ref } from "vue"
import { IGameAsset2D } from "../../models/Editor/IGameAsset2D"
import { useEditor } from "../../services/Editor/useEditor"
import useUser from "../../services/User/UserStore"

// define variables and constants
const emit = defineEmits(["confirm", "cancel"])
const { editorState } = useEditor(useUser().activeLobby.value.mapId)
const maxAmountCars = 100
const maxAmountPedestrians = 100
const amountAssets = Array<IGameAsset2D>()
const amountCars = ref(0)
const amountPedestrians = ref(0)

// fill gameAssets with game_assets from current map
const gameAssets = editorState.mapObjects.map((ele) => ele.game_assets)
const filledGameAssetArrays = gameAssets.filter((arr) => arr.length > 0)
filledGameAssetArrays.forEach((arr) => amountAssets.push(...arr))
// filter gameAssets to get current amount of assets of a type
const currentAmountPedestrians = amountAssets.filter((ele) => ele.objectTypeId > 49 && ele.objectTypeId < 60).length
const currentAmountCars = amountAssets.filter((ele) => ele.objectTypeId === 7).length
</script>

<template>
    <div class="modal-container">
        <div class="modal-body">
            <span class="modal-close" @click="emit('cancel')">X</span>
            <!-- Display current amount of assets -->
            <p>Aktuelle Anzahl: {{ currentAmountCars }} Autos und {{ currentAmountPedestrians }} Fussgaenger</p>
            <!-- Input for cars -->
            <h2 class="question">Wie viele weitere Fahrzeuge sollen platziert werden?</h2>
            <p>Auto: <input type="number" :min="0" :max="maxAmountCars" v-model="amountCars" /></p>
            <!-- Input for pedestrians -->
            <h2 class="question">Wie viele weitere Fussgaenger sollen platziert werden?</h2>
            <p>
                Fussgaengeranzahl:
                <input type="number" :min="0" :max="maxAmountPedestrians" v-model="amountPedestrians" />
            </p>
            <br />
            <div class="modal-action">
                <button
                    class="modal-button"
                    @click="emit('confirm', { car: amountCars, pedestrian: amountPedestrians })"
                >
                    Confirm
                </button>
                <button class="modal-button" @click="emit('cancel')">Cancel</button>
            </div>
        </div>
    </div>
</template>

<style>
.question {
    color: black;
}
.modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: #cececeb5;
    z-index: 5;
}
.modal-body {
    background-color: #fff;
    border: 2px solid #74a2cf;
    border-radius: 10px;
    text-align: center;
    padding: 20px 40px;
    min-width: 250px;
    display: flex;
    flex-direction: column;
}
.modal-action {
    display: flex;
    flex-direction: row;
    gap: 40px;
    justify-content: center;
}
.modal-button {
    cursor: pointer;
    height: 30px;
    padding: 0 25px;
    border: 2px solid #74a2cf;
    border-radius: 5px;
    background-color: #80b2e4;
    color: #fff;
}
.modal-close {
    cursor: pointer;
    position: relative;
    align-self: end;
    right: -33px;
    top: -17px;
}
</style>
