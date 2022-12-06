<template>
    <div class="container">
        <div class="content">
            <div class="headline">
                <h2>Login</h2>
            </div>
            <div class="content-form">
                <label>Benutzer</label>
                <input v-model="username" type="text" placeholder="Username" required />
                <label>Passwort</label>
                <input v-model="password" type="password" placeholder="Passwort" required />
                <label v-if="registrationMode">Passwort erneut eingeben</label>
                <input v-if="registrationMode" v-model="passwordRepeat" type="password" placeholder="Passwort" required />
                <hr>
                <BasicButton class="sec btn blue" :display="registrationMode ? 'Registrieren' : 'Login'" :btn_click="login"/>
                <BasicButton class="ter btn grey" :display="registrationMode ? 'Zurück zum Login' : 'Registrieren'" :btn_click="registration"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import useUser from "../../services/UserStore";
    import router from "../../router/router"
    import BasicButton from '../Buttons/BasicButton.vue';
    import { LoginService } from "../../services/Login/LoginService";	

    let username = ref("")
    let password = ref("")
    let passwordRepeat = ref("")
    let registrationMode = ref(false)
    let loginService = new LoginService();
    
    function login() {
        if (registrationMode.value) {
            loginService.register(username.value, password.value)
        }else{
            loginService.login(username.value, password.value)
        }
        
        router.push('/');
        
    }

    function registration() {
        registrationMode.value = !registrationMode.value
    }

</script>

<style scoped>
    *{
        box-sizing: border-box;
        
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
</style>