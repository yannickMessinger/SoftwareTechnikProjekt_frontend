<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue"

const emit = defineEmits(["confirm", "cancel"])
const amountCars = ref(0)
const maxAmountCars = 100
const amountPedestrians = ref(0)
const maxAmountPedestrians = 100
</script>

<template>
    <div class="modal-container">
        <div class="modal-body">
            <span class="modal-close" @click="emit('cancel')">🗙</span>
            <h2 class="question">Wie viele von welchen Fahrzeugen sollen platziert werden?</h2>
            <p>Auto: <input type="number" :min="0" :max="maxAmountCars" v-model="amountCars" /></p>
            <h2 class="question">Wie viele Fussgaenger sollen platziert werden?</h2>
            <p>Fussgaengeranzahl: <input type="number" :min="0" :max="maxAmountPedestrians" v-model="amountPedestrians" /></p>
            <br/>
            <div class="modal-action">
                <button class="modal-button" @click="emit('confirm', { car: amountCars, pedestrian: amountPedestrians})">Confirm</button>
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
