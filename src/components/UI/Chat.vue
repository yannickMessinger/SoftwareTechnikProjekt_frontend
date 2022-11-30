<template>
    <footer>
        <header class="msg-header">
            Chat
        </header>
        <main class="msg-chat">
            <div class="msg-message" v-for="(item, index) in chatHistory" :key="index">
                <div class="msg-info">
                    {{item.name}}
                </div>
                <div class="msg-text">
                    {{item.text}}
                </div>
            </div>
            <div id="anchor"></div>
        </main>
        
        <div class="msg-inputarea">
            <input class="msg-input" type="text" placeholder="Gebe deine Nachricht ein..." v-model="input">
            <BasicButton class="msg-send-btn" display="Senden" :btn_click="appendMessage"/>
        </div>
    </footer>
</template>

<script setup lang="ts">
    import {reactive, ref} from 'vue'
    import BasicButton from '../Buttons/BasicButton.vue';

    interface Message{
        name: string,
        text: string
    }

    let input = ref("")
    
    const chatHistory = ref([
        {name: "hans001", text: "Wer will eine Lobby aufmachen?"},
        {name: "peter001", text: "Ich machs! Kommt schnell rein, sonst wird sind die Plätze weg"},
        {name: "werner001", text: "Alles klar"}
    ])
    
    function appendMessage(){
        if(input.value){
            chatHistory.value.push({name: "norbert", text: input.value})
            input.value = ""
        }
        
    }
</script>

<style scoped>
    footer{
        box-sizing: border-box;
        position: fixed;
        bottom: 0px;
        background-color: var(--woe-gray-40);
        
        display: flex;
        flex-flow: column wrap;
        justify-content: space-between;
        width: 100%;
        max-width: 500px;
        height: 100%;
        max-height: 300px;
        border: 0.5px solid var(--woe-gray-90);
        border-radius: 5px;
    }

    .msg-header{
        display: flex;
        justify-content: space-between;
        padding: 5px;
        border-bottom: var(--woe-gray-90);
        background: var(--woe-gray-30);
        color: var(--woe-black);
    }

    .msg-chat {
        display: flex;
        flex-direction: column;
        scroll-behavior: auto;
        flex: 1;
        overflow-y: auto;
        padding: 10px;
    }

    .msg-chat::-webkit-scrollbar {
        width: 6px;
    }

    .msg-chat::-webkit-scrollbar-track {
        background: #ddd;
    }
    
    .msg-chat::-webkit-scrollbar-thumb {
        background: #bdbdbd;
    }

    .msg-message{
        display: flex;
        align-items: flex-end;
        margin-bottom: 10px;
    }
    .msg-message:last-of-type {
        margin: 0;
    }

    .msg-info{
        margin-right: 10px;
        font-weight: bold;
    }

    .msg-info-time {
        font-size: 0.7em;
    }

    .msg-inputarea {
        display: flex;
        margin: 10px 10px 10px 10px;
    }

    .msg-inputarea * {
        padding: 10px;
        border-radius: 8px;
        border: none;
        font-size: 1em;
    }

    .msg-input {
        flex: 1;
        background: #eee;
    }

    .msg-send-btn {
        margin-left: 10px;
        background: var(--woe-green-60);
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.23s;
    }

    .msg-send-btn:hover {
        background: var(--woe-green-70);
    }

    #anchor{
        overflow-anchor: auto;
    }
</style>