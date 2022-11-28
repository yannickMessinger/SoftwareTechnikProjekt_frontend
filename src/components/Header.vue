<template>
    <div class="header">
        <span>{{text}}</span>
        <PrimButton v-if=displayHomebutton id="home" display="" :btn_click="() => {router.push('/')}"></PrimButton>
    </div>
</template>

<script setup lang="ts">
    import PrimButton from '../components/Buttons/PrimButton.vue';
    import router from '../router/router';

    const props = defineProps({
        text: {
            type: String,
            required: false,
            default: "Header Text Field"
        },
        displayHomebutton: {
            type: Boolean,
            required: false,
            default: true
        }
    })
</script>

<style>
    .header {
        display: flex;
        background-color: #03006A;
        justify-content: space-between;
        align-items: center;
        height: 5em;
        
    }
    span{
        color: white;
        font-size: 1.5em;
        margin: 2em;
    }
    #home{
        margin: 2em;
        border-radius: 50%;
        width: 4em;
        height: 4em;
        background-color: white;
        background-size: cover;
        background-position: center;
        background-image: url("../assets/Icons/Home.svg");
    }
</style>