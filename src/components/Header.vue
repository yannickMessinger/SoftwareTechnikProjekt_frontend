<template>
    <div class="header">
        <span>World of eMobility</span>
        <PrimButton id="home" display="" :btn_click="() => {router.push('/')}"></PrimButton>
    </div>
</template>

<script setup lang="ts">
    import PrimButton from '../components/Buttons/PrimButton.vue';
    import router from '../router/router';

</script>

<style>
    .header {
        display: flex;
        background-color: #03006A;
        justify-content: space-between;
        align-items: center;
        padding: 1em;
    }
    span{
        color: white;
        font-size: 1.5em;
    }
    #home{
        border-radius: 50%;
        width: 4em;
        height: 4em;
        background-color: white;
        background-size: cover;
        background-position: center;
        background-image: url("../assets/Icons/Home.svg");
    }
</style>