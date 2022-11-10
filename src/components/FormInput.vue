<script setup lang="ts">

defineProps<{
    labelName: string,
    buttonName: string
}>();

</script>


<template>
    <form>
        <label>{{labelName}}</label>
        <input type="text" required>
        <br>
        <button>{{buttonName}}</button>
    </form>
</template>


<style scoped>

label {
    display: block;
    margin: 20px 0 10px;
}

input {
    font-size: 25px;
    border: 1px double #777;
    border-radius: 4px;
    padding: 10px;
}

button {
    font-size: 16px;
    color: #000;
    background: #fff;
    padding: 0.4rem 1.3rem;
    text-align: center;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    margin: 10px;
}

</style>