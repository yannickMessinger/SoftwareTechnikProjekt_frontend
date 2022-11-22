<template>
    <button class="button" @click="btn_click">{{display}}</button>
</template>

<script setup lang="ts">
    import { defineComponent } from "vue"

    const props = defineProps({
        display: {
            type: String,
            required: false,
            default: "Primary Button"
        },
        btn_click: {
            type: Function,
            required: false
        }
    })
</script>

<style>
    .button {
        background-color: #FFFFFF;
        border: 1px solid #222222;
        border-radius: 8px;
        box-sizing: border-box;
        color: #222222;
        cursor: pointer;
        display: inline-block;
        font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        margin: 0;
        outline: none;
        padding: 13px 23px;
        position: relative;
        text-align: center;
        text-decoration: none;
        touch-action: manipulation;
        transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
        user-select: none;
        -webkit-user-select: none;
        width: auto;
    }

    .button:focus-visible {
        box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
        transition: box-shadow .2s;
    }

    .button:active {
        background: #F6F9FE;
        border-color: #000000;
        transform: scale(.96);
    }

    .button:disabled {
        border-color: #DDDDDD;
        color: #DDDDDD;
        cursor: not-allowed;
        opacity: 1;
    }
    .button:hover {
        background: #F6F9FE;
    }

</style>