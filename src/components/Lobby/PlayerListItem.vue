<!-- Component that represents a single player in the player list-->
<!--Only the name is displayed-->

<!--
<template>
    <tr>
        <td>{{props.player.name}}</td>
    </tr>

</template>
-->
<template>
    <div class="cell">
        <table>
            <tr>
                <div class="cellone">
                    <td style="width: 100%">{{ props.player.userName }}</td>
                </div>
                <td style="width: 10%">
                    <button v-if="userId !== props.player.userId">Nachricht</button>
                </td>
                <td style="width: 10%">
                    <button class="deleteButton" v-if="userId === hostId && userId !== props.player.userId">X</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup lang="ts">
import IUser from "../../typings/IUser"
import useUser from "../../services/UserStore"

const { userId, hostId } = useUser()

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
