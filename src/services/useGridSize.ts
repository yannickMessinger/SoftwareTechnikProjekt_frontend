import { reactive, readonly } from 'vue'

const sizeState = reactive({size: 40})

export function useGridSize() {
    function increaseSize(a: number){
        sizeState.size += a
    }
        
    function decreaseSize(a: number){
        sizeState.size -= a
    }

    return{
        gridSize: readonly(sizeState),
        increaseSize,
        decreaseSize
    }
}
