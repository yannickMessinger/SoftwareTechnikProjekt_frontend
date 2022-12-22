<template>
    <footer>
        <header class="msg-header">
            <p>Chat</p>
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
        <transition name="slide">
            <div id="msg-chat" v-bind="chatRef" v-if="visible">
                <div
                    id="msg-message"
                    v-for="(item, index) in chat.chatList"
                    :key="index"
                >
                    <p class="">
                        <strong>{{ item.author }}</strong
                        >:{{ item.message }}
                    </p>
                </div>
            </div>
        </transition>
        <transition name="slide">
            <div id="msg-inputarea" v-if="visible" @keyup.enter="appendMessage">
                <input
                    class="msg-input"
                    type="text"
                    placeholder="Gebe deine Nachricht ein..."
                    v-model="input"
                />
                <BasicButton
                    class="msg-send-btn"
                    display="Senden"
                    :btn_click="appendMessage"
                />
            </div>
        </transition>
    </footer>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue"
    import BasicButton from "../Buttons/BasicButton.vue"
    import { useChat } from "../../services/Chat/useChat"
    import useUser from "../../services/UserStore"

    interface Message {
        name: string
        text: string
    }
    const chatHistory = ref<Message[]>([])
    const chatLength = 20
    let input = ref("")
    let chatRef = ref()
    let visible = ref(false)
    const { name, setName, setId, activeLobby } = useUser()
    const { chat, sendMessage, connect, sendLobbyMessage } = useChat(name.value)

    onMounted(() => {
        connect()
        console.log(`chat lobby id ${chat.activeLobbyId}`)
    })

    function appendMessage() {
        let a = document.getElementById("msg-chat")
        if (input.value && a) {
            //chatHistory.value.push({ name: "user001: ", text: input.value }) // TODO: Username hier setzen
            //chat.chatList.push({ message: input.value, author: name.value })
            if (chat.activeLobbyId !== -1) {
                sendLobbyMessage(input.value)
            } else {
                sendMessage(input.value)
            }

            chatHistory.value.length > chatLength
                ? chatHistory.value.shift()
                : undefined
            input.value = ""
            a.scrollTop = a.scrollHeight
        }
    }
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

    #msg-close-btn-visible {
        background-image: url("../../assets/Icons/Chat_closed.svg");
    }

    #msg-close-btn-not-visible {
        background-image: url("../../assets/Icons/Chat_open.svg");
    }
</style>
