<template>
    <div class="headline">
        <h2>Aktive Lobby</h2>
    </div>
    <div class="content">
        <div class="row">
            <p><b>Rüdigers Lobby</b></p>
            <button class="red">Lobby Schließen</button>
        </div>
        <div class="row">
            <p><b>Modus:</b> Fahrmodus</p>
            <button>Planungs-Modus</button>
        </div>
        <div class="bottomrow">
            <button>Weitermachen</button>
            <button class="green">Fahren</button>
            <button class="grey">Lobby verlassen</button>
        </div>
    </div>
</template>


<script setup lang="ts">

</script>

<style scoped>

* {
    font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
    line-height: 20px;
}
.headline {
    display: flex;
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: 10px;
}
.row {
    display: flex; 
    flex-direction: row;
    justify-content: space-between;

}
.content {
    font-weight: 500;
    font-size: 16px;
    height: 300px;
    padding-left: 30px;
    padding-right: 30px;
}

.bottomrow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

button {
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    padding: 13px 23px;
    background-color: var(--woe-blue-60);
    color: white;
}

button:hover {
    background-color: var(--woe-blue-70);
}

.red {
    background: var(--woe-red-60);
}

.red:hover {
    background-color: var(--woe-red-70);
}

.grey {
    background-color: var(--woe-gray-50);
}

.grey:hover {
    background-color: var(--woe-gray-60);
}

.green {
    background-color: var(--woe-green-60);
}

.green:hover {
    background-color: var(--woe-green-70);
}
</style>