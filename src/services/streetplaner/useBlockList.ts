import { reactive, readonly } from "vue"
import type { IBlockElement } from "../../services/streetplaner/IBlockElement"
import BigBuilding from "../../assets/2D_Models/Buildings/BigBuilding.png"
import Building from "../../assets/2D_Models/Buildings/Building.png"
import Supermarkt from "../../assets/2D_Models/Buildings/Supermarkt.png"
import Stadium from "../../assets/2D_Models/Buildings/Stadium.png"

export interface IBlockListState {
    list: Array<IBlockElement>
    error: string
}

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
            console.log("error")
            throw new Error(response.statusText)
        }
        let data = await response.json()
        blockListState.list = data
    } catch (error: any) {
        blockListState.error = error.message
        console.log("failed to fetch blocks from backend")
    }
}
