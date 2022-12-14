<template>
    <div class="container">
        <div class="content">
            <div class="headline">
                <h2>{{headline}}</h2>
            </div>
            <div class="content-form">
                <label>Benutzer</label>
                <input :class="usernameError != '' ? 'error-input' : '' " v-model="username" type="text" placeholder="Username" required />
                <label class="error">{{usernameError}}</label>
                <label>Passwort</label>
                <input v-model="password" :class="passwordError != '' ? 'error-input' : '' " type="password" placeholder="Passwort" required />
                <label class="error">{{passwordError}}</label>
                <label v-if="registrationMode">Passwort erneut eingeben</label>
                <input v-if="registrationMode" :class="passwordError != '' ? 'error-input' : '' " v-model="passwordRepeat" type="password" placeholder="Passwort" required />
                <label v-if="registrationMode" class="error">{{passwordError}}</label>
                <hr>
                <BasicButton v-if="!registrationMode" class="sec btn blue" :display="'Login'" :btn_click="loginCheck"/>
                <BasicButton v-if="!registrationMode" class="ter btn grey" :display="'Zum Registrieren'" :btn_click="toggleMode"/>
                <BasicButton v-if="registrationMode" class="sec btn blue" :display="'Registrieren'" :btn_click="registrationCheck"/>
                <BasicButton v-if="registrationMode" class="ter btn grey" :display="'Zurück zum Login'" :btn_click="toggleMode"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import router from "../../router/router"
    import BasicButton from '../Buttons/BasicButton.vue';
    import useUser from '../../services/UserStore'

    const username = ref("")
    const password = ref("")
    const passwordRepeat = ref("")
    const registrationMode = ref(false)
    const headline = ref("Login")
    const usernameError = ref("")
    const passwordError = ref("")
    const {login, register} = useUser()
    
    async function loginCheck() {
        let responseBody = await login(username.value, password.value)
        
        if (responseBody != null) {
            console.log(responseBody)
            router.push('/');
        } else {
            usernameError.value = "Username und Passwort Kombination gibt es nicht"
            passwordError.value = "Username und Passwort Kombination gibt es nicht"
            console.log("Status 400")
        }
    }

    async function registrationCheck(){
        if(password.value == passwordRepeat.value){
            let responseBody = await register(username.value, password.value)
            passwordError.value = ""
            if (responseBody != null) {
                console.log(responseBody)
                toggleMode()
            } else {
                console.log("Status 400")   
            }
        }  else {
            passwordError.value = "Passwort stimmt nicht überein"
        }
    }
    function toggleMode() {
        registrationMode.value = !registrationMode.value
        registrationMode.value == true ? headline.value = 'Registrieren' : headline.value = 'Login'
        username.value = ""
        password.value = ""
        passwordRepeat.value = ""
        usernameError.value = ""
        passwordError.value = ""
    }
</script>

<style scoped>
    *{
        box-sizing: border-box;
        
    }

    h2{
        margin-top: 0.83em;
        margin-bottom: 0.83em;
    }

    .container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        
    }

    .content{
        margin-top: 50px;
        padding: 24px;
        width: 500px;
        background-color: var(--woe-gray-30);
        border-radius: 8px;
    }

    .headline{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 32px;
        position: relative;
    } 

    .content-form{
        display: flex;
        flex-direction: column;
        align-content: space-between;
        gap: 10px;
    }

    input{
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
    
    .error-input{
        border-color: red;
    }

</style>