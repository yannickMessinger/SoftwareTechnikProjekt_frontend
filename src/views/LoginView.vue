<script setup lang="ts">
import { ref } from "vue";
import useUser from "../service/UserStore";
import router from "../router/router"
import PrimButton from "../components/Buttons/PrimButton.vue";

let username = ref("")
let password = ref("")
const { name, setName } = useUser();

function sendUsername() {
  setName(username.value);
  // Methode, wenn auf Button geklickt wird hier hin...
  router.push('/');
}
</script>


<template>
  <h1>Login</h1>
  <label>Benutzer</label>
  <input v-model="username" type="text" required />
  <label>Passwort</label>
  <input v-model="password" type="text" required />
  <br>
  <PrimButton display="Anmelden" :btn_click="sendUsername"></PrimButton>
  <PrimButton display="Registrieren" :btn_click="() => {}"></PrimButton>

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
</style>
