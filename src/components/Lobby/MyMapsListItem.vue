<template>
    <div class="cell">
        <table>
            <tr>
                <td style="width: 25%">{{ props.map.name }}</td>
                <td style="width: 15%">{{ props.map.datum }}</td>
                <!--<td style="width:30%"><button>Lobby erstellen</button></td>-->
                <td style="width: 30%">
                    <BasicButton
                        class="sec btn blue"
                        display="Lobby öffnen"
                        :btn_click="
                            () => {
                                router.push('/lobbyview')
                            }
                        "
                    />
                </td>
                <td style="width: 1%">
                    <button class="deleteButton">X</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup lang="ts">
    import { IMyMapsListItem } from "../../typings/IMyMapsListitem"
    import BasicButton from "../Buttons/BasicButton.vue"
    import router from "../../router/router"

    const props = defineProps<{
        map: IMyMapsListItem
    }>()
</script>

<style scoped>
    * {
        font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto,
            "Helvetica Neue", sans-serif;
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
        padding-left: 30px;
    }
</style>
