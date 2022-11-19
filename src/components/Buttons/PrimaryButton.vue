<script setup lang="ts">

defineProps<{ 
    name: string,
    linkTo: string
}>();

</script>


<template>
    <RouterLink v-bind:to="linkTo">
        <button>{{name}}</button>
    </RouterLink>
</template>


<style>

button {
    padding: 5px 15px;
    font-size: 18px;
    color:#ddd;
    cursor: pointer;
    margin: 5px;
    background-color: #555;
}
button:hover, button:focus {
    background-color: goldenrod;
    border-color: #555;
    color:black;
}

</style>