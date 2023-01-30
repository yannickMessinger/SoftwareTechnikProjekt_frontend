<template>
    <div class="container">
        <div class="content">
            <div class="headline">
                <h2>{{ headline }}</h2>
            </div>
            <div class="content-form">
                <label>Benutzer</label>
                <input
                    :class="usernameError != '' ? 'error-input' : ''"
                    v-model="username"
                    type="text"
                    placeholder="Username"
                    required
                />
                <label class="error">{{ usernameError }}</label>
                <label>Passwort</label>
                <input
                    v-model="password"
                    :class="passwordError != '' ? 'error-input' : ''"
                    type="password"
                    placeholder="Passwort"
                    required
                />
                <label class="error">{{ passwordError }}</label>
                <label v-if="registrationMode">Passwort erneut eingeben</label>
                <input
                    v-if="registrationMode"
                    :class="passwordError != '' ? 'error-input' : ''"
                    v-model="passwordRepeat"
                    type="password"
                    placeholder="Passwort"
                    required
                />
                <label v-if="registrationMode" class="error">{{ passwordError }}</label>
                <hr />
                <BasicButton
                    v-if="!registrationMode"
                    class="sec btn blue"
                    :display="registrationMode ? 'Registrieren' : 'Login'"
                    :btn_click="loginCheck"
                />
                <BasicButton
                    v-if="!registrationMode"
                    class="ter btn grey"
                    :display="registrationMode ? 'Zurück zum Login' : 'Registrieren'"
                    :btn_click="toggleMode"
                />
                <BasicButton
                    v-if="registrationMode"
                    class="sec btn blue"
                    :display="'Registrieren'"
                    :btn_click="registrationCheck"
                />
                <BasicButton
                    v-if="registrationMode"
                    class="ter btn grey"
                    :display="'Zurück zum Login'"
                    :btn_click="toggleMode"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import useUser from "../../services/UserStore"
import router from "../../router/router"
import BasicButton from "../Buttons/BasicButton.vue"
import { useChat } from "../../services/Chat/useChat"

const { login, register, logindata, activeLobby, name } = useUser()
const { connectGlobalChat } = useChat(name.value, activeLobby.value)

const username = ref("")
const password = ref("")
const passwordRepeat = ref("")
const registrationMode = ref(false)
const headline = ref("Login")
const usernameError = ref("")
const passwordError = ref("")
connectGlobalChat()

/**
 * Performs a login check.
 * 
 * Makes a call to the `login` function with the provided `username.value` and `password.value` as arguments.
 * If the response body has properties `userId` and `userName`, the user is redirected to the `/lobby` route.
 * Otherwise, an error message is set in the `usernameError.value` property.
 * 
 * @async
 */
async function loginCheck() {
    let responseBody = await login(username.value, password.value)

    if (responseBody?.hasOwnProperty("userId") && responseBody?.hasOwnProperty("userName")) {
        router.push("/lobby")
    } else {
        usernameError.value = "Username und Passwort Kombination gibt es nicht"
    }
}

/**
 * Performs a registration check.
 * 
 * Clears any existing error messages in the `usernameError.value` and `passwordError.value` properties.
 * If the `password.value` and `passwordRepeat.value` are equal, a call to the `register` function is made with the `username.value` and `password.value` as arguments.
 * Depending on the response body, the following actions are performed:
 *  - If response is -1, sets error messages in both `usernameError.value` and `passwordError.value` properties to "Ungültige Eingabe".
 *  - If response is -2, sets error message in `usernameError.value` property to "Username bereits vergeben".
 *  - If response is null, does nothing.
 *  - Otherwise, calls the `toggleMode` function.
 * If the `password.value` and `passwordRepeat.value` are not equal, sets error message in the `passwordError.value` property to "Passwort stimmt nicht überein".
 * 
 * @async
 */
async function registrationCheck() {
    usernameError.value = ""
    passwordError.value = ""
    if (password.value == passwordRepeat.value) {
        let responseBody = await register(username.value, password.value)
        passwordError.value = ""
        switch (responseBody) {
            case -1:
                usernameError.value = "Ungültige Eingabe"
                passwordError.value = "Ungültige Eingabe"
                break
            case -2:
                usernameError.value = "Username bereits vergeben"
                break
            case null:
                break
            default:
                toggleMode()
        }
    } else {
        passwordError.value = "Passwort stimmt nicht überein"
    }
}

/**
 * Toggles the registration mode.
 * 
 * Inverts the value of the `registrationMode.value` property.
 * If `registrationMode.value` is `true`, sets the `headline.value` property to "Registrieren".
 * Otherwise, sets the `headline.value` property to "Login".
 * Clears the values of the `username.value`, `password.value`, and `passwordRepeat.value` properties.
 * Clears the error message in the `usernameError.value` property.
 */
function toggleMode() {
    registrationMode.value = !registrationMode.value
    registrationMode.value == true ? (headline.value = "Registrieren") : (headline.value = "Login")
    username.value = ""
    password.value = ""
    passwordRepeat.value = ""

    usernameError.value = ""
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

h2 {
    margin-top: 0.83em;
    margin-bottom: 0.83em;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.content {
    margin-top: 50px;
    padding: 24px;
    width: 500px;
    background-color: var(--woe-gray-30);
    border-radius: 8px;
}

.headline {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    position: relative;
}

.content-form {
    display: flex;
    flex-direction: column;
    align-content: space-between;
    gap: 10px;
}

input {
    width: auto;
    height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--woe-gray-40);
    border-radius: 5px;
}

hr {
    height: 1px;
    width: 100%;
    margin: 20px 0;
}

.error {
    color: red;
}
</style>
