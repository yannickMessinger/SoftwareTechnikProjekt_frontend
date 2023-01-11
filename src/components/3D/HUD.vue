<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from "vue"

export default defineComponent({
    components: {},

    setup() {
        const gametime = ref(0)
        const points = ref(0)
        const updateCurrentTime = () => {
            gametime.value += 1
        }
        const intervalHandle = setInterval(updateCurrentTime, 1000)

        onBeforeUnmount(() => {
            clearInterval(intervalHandle)
        })

        return {
            gametime,
            points,
        }
    },
})
</script>

<template>
    <div>
        <h1>{{ gametime }}</h1>
        <h1 class="highscore">Score: {{ points }}</h1>
    </div>
</template>

<style>
.highscore {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 50px;
    text-align: right;
}
</style>
