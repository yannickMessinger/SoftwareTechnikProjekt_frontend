<template>
    <div class="cell">
        <table>
            <tr>
                <div class="cellone">
                    <td style="width: 100%">{{ props.player.userName }}</td>
                </div>
            </tr>
        </table>
    </div>
</template>

<script setup lang="ts">
import IUser from "../../models/User/IUser"

const props = defineProps<{
    player: IUser
}>()
</script>

<style scoped>
* {
    font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
}
button {
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

.deleteButton {
    background: var(--woe-gray-50);
    border: none;
    border-radius: 8px;
    opacity: 1;
}

.deleteButton:hover {
    background-color: var(--woe-red-70);
}

td {
    padding-bottom: 20px;
}

.cellone {
    padding-left: 30px;
}
</style>
