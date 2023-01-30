import { reactive } from "vue"
import type { IBlockElement } from "../../models/Editor/IBlockElement"
/**
 * blockList is a list of blocks which are placeable in the Editor
 */
export interface IBlockListState {
    list: Array<IBlockElement>
    error: string
}

// state in which blockList is saved
const blockListState = reactive({
    list: [],
    error: "",
})

export function useBlockList() {
    return {
        blockListState: blockListState,
        updateBlockList,
    }
}

// fetches blocklist from backend (currently only frontend)
export async function updateBlockList(): Promise<void> {
    const url = "/api/mapobject/list"

    try {
        const response = await fetch(url, { method: "GET" })
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        let data = await response.json()
        blockListState.list = data
    } catch (error: any) {
        blockListState.error = error.message
    }
}
