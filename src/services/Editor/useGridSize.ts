import { reactive, readonly } from "vue"

const sizeState = reactive({ size: 55 })

export function useGridSize() {
    function changeSize(value: number) {
        sizeState.size = value
    }

    return {
        gridSize: readonly(sizeState),
        changeSize,
    }
}
