<template>
    <div class="header">
        <span>World of eMobility</span>
        <span class="right"> {{ logindata.userName }}</span>
        <div class="right">
            <BasicButton
                v-if="logindata.loggedIn && activeLobby.lobbyId < 0"
                class="cncl btn red"
                display="Logout"
                :btn_click="
                    () => {
                        logout()
                        router.push('/login')
                    }
                "
            />
            <BasicButton
                v-if="displayHomebutton"
                id="home"
                display=""
                :btn_click="
                    () => {
                        if (router.currentRoute.value.name?.toString() === 'Edit') {
                            emit('validate-grid-event', true)
                        }
                        if (logindata.activeLobby.lobbyId == -1) router.push('/lobby')
                    }
                "
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import router from "../router/router"
import BasicButton from "./Buttons/BasicButton.vue"
import useUser from "../services/UserStore"
import useEventBus from "../services/eventBus"
import { ref, watch } from "vue"

const { logout, activeLobby, logindata } = useUser()
const { bus, emit } = useEventBus()

const props = defineProps({
    text: {
        type: String,
        required: false,
        default: "Header Text Field",
    },
    displayHomebutton: {
        type: Boolean,
        required: false,
        default: true,
    },
})
watch(
    () => bus.value.get("is-valid-event"),
    (val) => {
        if (val[0]) {
            router.push("/lobbyview")
        }
    }
)
</script>

<style scoped>
.header {
    display: flex;
    background-color: var(--woe-blue-80);
    justify-content: space-between;
    align-items: center;
    height: 5em;
}
.header .right {
    display: flex;
    align-items: center;
    margin: 2em;
}
span {
    color: var(--woe-white-almost);
    font-size: 1.5em;
    margin: 2em;
}
#home {
    margin: 2em;
    width: 4em;
    height: 4em;
    border-radius: 50%;
    background-color: var(--woe-white-almost);
    background-size: cover;
    background-position: center;
    background-image: url("../assets/Icons/Home.svg");
}
</style>
