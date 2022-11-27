<script setup lang="ts">
import { defineComponent } from 'vue';
import PrimButton from '../Buttons/PrimButton.vue';
import router from '../../router/router';

</script>

<template>
    <div class="menu">
        <ul class="ul-class">
            <li class="ul-li-class">
                <PrimButton display="Startseite" :btn_click="() => {router.push('/')}"></PrimButton>
            </li>
        </ul>
    </div>
</template>

<style>
    .ul-class {
        list-style-type: none;
        display: flex;
        justify-content: center;
        margin: 3;
        padding: 0;
        overflow: hidden;
        background-color: #242424;
    }
    .ul-li-class {
        display: list-item;
        background: #333;
        padding: 15px 30px;
        color:white;
        margin: 0 3px;
    }
    a {
        font-weight: 500;
        color: #14af21;
        text-decoration: inherit;
    }
    a:hover {
        color: #b5e211;
    }
</style>