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

td {
    padding-bottom: 20px;
}

.cellone {
    padding-left: 30px;
}
</style>
