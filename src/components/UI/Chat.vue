<template>
    <footer>
        <header class="msg-header">
            <p>Chat</p>
            <div class="msg-drowdown">
                <select v-model="chatMode">
                    <option value="global">Globaler Chat</option>
                    <option v-if="chat.activeLobbyId !== -1" value="lobby">Lobby: {{ activeLobby.lobbyName }}</option>
                </select>
            </div>
            <BasicButton
                class="msg-close-btn"
                id="msg-close-btn-not-visible"
                v-if="visible"
                display=" "
                :btn_click="hideChat"
            />
            <BasicButton
                class="msg-close-btn"
                id="msg-close-btn-visible"
                v-if="!visible"
                display=" "
                :btn_click="hideChat"
            />
        </header>
        <div id="msg-chat" v-bind="chatRef" v-if="visible">
            <div v-if="chatMode === 'global'">
                <div id="msg-message" v-for="(item, index) in chat.chatList" :key="index">
                    <p class="msg-message">
                        <strong style="color: blue">{{ item.author }}</strong
                        >: {{ item.message }}
                    </p>
                </div>
            </div>
            <div v-else-if="chatMode === 'lobby'">
                <div id="msg-message" v-for="(item, index) in chat.chatList_lobby" :key="index">
                    <div v-if="item.type === 'CHAT'">
                        <p class="msg-message">
                            <strong style="color: blue">{{ item.author }}</strong
                            >: {{ item.message }}
                        </p>
                    </div>
                    <div v-else-if="item.type === 'JOIN'">
                        <p style="color: green">
                            {{ item.message }}
                        </p>
                    </div>
                    <div v-else-if="item.type === 'LEAVE'">
                        <p style="color: red">
                            {{ item.message }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <transition name="slide">
            <div id="msg-inputarea" v-if="visible" @keyup.enter="appendMessage">
                <input class="msg-input" type="text" placeholder="Gebe deine Nachricht ein..." v-model="input" />
                <BasicButton class="msg-send-btn" display="Senden" :btn_click="appendMessage" />
            </div>
        </transition>
    </footer>
</template>

<script setup lang="ts">
import { onUpdated, reactive, ref, toRef, unref } from "vue"
import BasicButton from "../Buttons/BasicButton.vue"
import { useChat } from "../../services/Chat/useChat"
import useUser from "../../services/User/UserStore"

interface Message {
    name: string
    text: string
}
const chatHistory = ref<Message[]>([])
const chatLength = 20
let input = ref("")
let chatRef = ref()
let visible = ref(false)
const { name, activeLobby } = useUser()
const { chat, sendMessage, sendLobbyMessage } = useChat(name.value, activeLobby.value)
const chatMode = ref("global")

let test = unref(activeLobby)
const test2 = reactive(test)
const test3 = toRef(test2, "lobbyId")

/**
 * Scroll the element with ID "msg-chat" to the bottom when the component updates.
 * @function
 * @name onUpdated
 */
onUpdated(() => {
    let a = document.getElementById("msg-chat")
    if (a) {
        a.scrollTop = a.scrollHeight
    }
})

/**
 * Append a new message to the chat.
 * The message will be sent either to the lobby or to a specific chat room,
 * depending on the value of chatMode.value. The message will be sent using
 * either sendLobbyMessage or sendMessage function.
 * If the input value is truthy and the msg-chat element exists, the message will be appended.
 * The chat history will be limited to chatLength by shifting the oldest messages.
 * @function
 * @name appendMessage
 */
function appendMessage() {
    let a = document.getElementById("msg-chat")
    if (input.value && a) {
        if (chatMode.value === "lobby") {
            sendLobbyMessage(input.value)
        } else {
            sendMessage(input.value)
        }

        chatHistory.value.length > chatLength ? chatHistory.value.shift() : undefined
        input.value = ""
    }
}

/**
 * Toggles the visibility of the chat.
 * @function
 * @name hideChat
 */
function hideChat() {
    visible.value = !visible.value
}
</script>

<style scoped>
footer {
    box-sizing: border-box;
    position: fixed;
    bottom: 0px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: 500px;
    max-height: 300px;
    border-top-right-radius: 16px;
    border: 1px solid var(--woe-gray-90);
    border-left: none;
    border-bottom: none;
    background-color: var(--woe-white);
    z-index: 2;
}

.msg-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
}

#msg-chat {
    flex: 1;
    scroll-behavior: auto;
    overflow-y: auto;
    padding: 0 0 0 20px;
}

#msg-chat::-webkit-scrollbar {
    width: 10px;
}

#msg-chat::-webkit-scrollbar-track {
    background: #ddd;
}

#msg-chat::-webkit-scrollbar-thumb {
    background: #bdbdbd;
}

#msg-inputarea {
    display: flex;
    margin: 10px;
}

#msg-inputarea * {
    padding: 10px;
    border-radius: 8px;
    border: none;
    font-size: 1em;
}

.msg-input {
    flex: 1;
    background: var(--woe-gray-20);
}

.msg-send-btn {
    margin-left: 10px;
    background: var(--woe-green-60);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
}

.msg-send-btn:hover {
    background: var(--woe-green-70);
}

.msg-close-btn {
    padding: 5px;
    width: 2em;
    height: 2em;
    background: none;
    background-size: cover;
    background-position: center;
}

.msg-drowdown select {
    background-color: transparent;
    border: 4px;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-family: inherit;
    cursor: inherit;
    line-height: inherit;
}

#msg-close-btn-visible {
    background-image: url("../../assets/Icons/Chat_closed.svg");
}

#msg-close-btn-not-visible {
    background-image: url("../../assets/Icons/Chat_open.svg");
}
</style>
