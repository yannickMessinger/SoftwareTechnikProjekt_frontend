<template>
    <footer>
        <header class="msg-header">
            Chat
            <BasicButton class="msg-close-btn" display="X" :btn_click="hideChat"/>
        </header>
        <div id="msg-chat" v-bind="chat" v-if="visible">
            <div id="msg-message" v-for="(item, index) in chatHistory" :key="index">
                <p class=""><strong>{{item.name}}</strong>{{item.text}}</p>
            </div>
        </div>
        
        <div id="msg-inputarea" v-if="visible" @keyup.enter="appendMessage">
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
    const chatHistory = ref<Message[]>([])
    const chatLength = 20
    let input = ref("")
    let chat = ref()
    let visible = ref(false)
    
    function appendMessage(){
        let a = document.getElementById('msg-chat')
        if(input.value && a){
            chatHistory.value.push({name: "norbert: ", text: input.value})
            chatHistory.value.length > chatLength ? chatHistory.value.shift() : undefined
            input.value = ""   
            a.scrollTop = a.scrollHeight
        }
    }
    function hideChat(){
       visible.value = !visible.value   
    }
</script>

<style scoped>
    footer{
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
        border-radius: 16px;
        border: 1px solid var(--woe-gray-90);
        
    }

    p{
        margin: 0;
    }

    .msg-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-bottom: var(--woe-gray-90);
        background: var(--woe-gray-30);
        color: var(--woe-black);
    }

    #msg-chat {
        flex: 1;
        scroll-behavior: auto;
        overflow-y: auto;
        padding: 0 0 0 20px ;
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
        transition: background 0.23s;
    }

    .msg-send-btn:hover {
        background: var(--woe-green-70);
    }

    .msg-close-btn{
        background: none;
        color: var(--woe-black);
        padding: 5px;
    }
</style>