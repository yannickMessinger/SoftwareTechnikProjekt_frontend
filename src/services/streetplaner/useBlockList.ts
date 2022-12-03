import { reactive } from "vue"
import type { IBlockElement } from '../../services/streetplaner/IBlockElement';

const blockList = reactive(Array<IBlockElement>());
const pathToPictures = "/img/streetplaner/";

export function useBlockList() {
    return {
        blockList: blockList,
        updateBlockList
    }
}

export async function updateBlockList(): Promise<void> {
    const url = "api/block";

    try {
        // Todo, get blocks from backend
        throw new Error();
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
    }
    catch {
        // Todo, load from json format
        blockList.splice(0, blockList.length);
        blockList.push(...[
            { groupId: 0,group: "Testobject1",id: 0,type:"???",name:"straight",heading:0,texture: (pathToPictures+"object-icons/straight.png")},
            { groupId: 0,group: "Testobject1",id: 1,type:"???",name:"curve",heading:0,texture: (pathToPictures+"object-icons/curve.png")},
            { groupId: 1,group: "Testobject2",id: 2,type:"???",name:"cross",heading:0,texture: (pathToPictures+"object-icons/cross.png")}
        ]);
    }
}