<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
            <label for="map_name"> <b>Karte-Name</b></label>
            <input type="text" name="map_name" placeholder="Kartenname eingeben"/>
            <button class="close-popup">Karte hinzufügen</button>
            <button class="close-popup">schließen</button>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        props:['TogglePopup']
    }
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-inner{
    background: #FFF;
    padding: 32px;

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
</style>