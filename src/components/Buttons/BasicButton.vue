<template>
    <button class="button" v-on="btn_click ? {click: btn_click} : {}">{{display}}</button>
</template>

<script setup lang="ts">
    import { defineComponent } from "vue"

    const props = defineProps({
        display: {
            type: String,
            required: false,
            default: "Button"
        },
        btn_click: {
            type: Function,
            required: false
        }
    })
</script>

<style scoped>
    .button {
        border: 0px solid #222222;
        border-radius: 8px;
        box-sizing: border-box;
        color: black;
        cursor: pointer;
        display: inline-block;
        font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        padding: 13px 23px;
        position: relative;
        text-align: center;
        touch-action: manipulation;
        transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
        width: auto;
    }

    .button:active {
        border-color: #000000;
        transform: scale(.96);
    }

</style>