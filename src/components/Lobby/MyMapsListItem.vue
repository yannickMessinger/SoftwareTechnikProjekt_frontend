<template>
    <div class="cell">
        <table>
            <tr>
                <td>{{props.map.name}}</td>
                <td>{{props.map.datum}}</td>
                <td><button>Lobby erstellen</button></td>
            </tr>
        </table>
    </div>
</template>

<script setup lang = 'ts'>

import { IMyMapsListItem } from '../../typings/IMyMapsListitem';

const props = defineProps<{
    map: IMyMapsListItem
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

</style>