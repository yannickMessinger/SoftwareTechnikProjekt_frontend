<script setup lang="ts">
import { ref } from "vue";
import useUser from "../service/UserStore";

let username = ref("");
const { name, setName, sendName } = useUser();

function sendUsername() {
  setName(username.value);
  // Methode, wenn auf Button geklickt wird hier hin...
  sendName();
}
</script>


<template>
  <h1>Welcome to eMobility</h1>
  <label>Username</label>
  <input v-model="username" type="text" required />
  <br />
  <button @click="sendUsername">OK</button>
</template>


<style scoped>
label {
  display: block;
  margin: 20px 0 10px;
}

input {
  font-size: 25px;
  border: 1px double #777;
  border-radius: 4px;
  padding: 10px;
}

button {
  font-size: 16px;
  color: #000;
  background: #fff;
  padding: 0.4rem 1.3rem;
  text-align: center;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin: 10px;
}
</style>
