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
                <td style="width:100%">{{props.player.name}}</td>
                <td style="width:10%"><button>Nachricht</button></td>
                <td style="width:10%"><button class="deleteButton">X</button></td>
            </tr>
        </table>
    </div>
</template>

<script setup lang = 'ts'>

import { IPlayerListItem } from '../../typings/IPlayerListItem';

const props = defineProps<{
    player: IPlayerListItem
}>()
</script>

<style scoped>

button {
  background-color: #0012af;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  padding: 8px 25px;
  font-size: 14px;
  font-weight: bold;
  margin: 4px 2px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  border: 1px solid #707070;
  border-radius: 10px;
}

button:hover {
    background-color: #000d80;
}

.deleteButton {
    background: #B50000 0% 0% no-repeat padding-box;
    border: 1px solid #707070;
    border-radius: 10px;
    opacity: 1;
}


.deleteButton:hover {
    background: #900000;
}
</style>