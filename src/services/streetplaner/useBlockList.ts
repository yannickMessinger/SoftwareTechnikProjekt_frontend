import { reactive } from "vue"
import type { IBlockElement } from '../../services/streetplaner/IBlockElement';
import BigBuilding from "../../assets/2D_Models/Buildings/BigBuilding.png";
import Building from "../../assets/2D_Models/Buildings/Building.png";
import Supermarkt from "../../assets/2D_Models/Buildings/Supermarkt.png";
import Stadium from "../../assets/2D_Models/Buildings/Stadium.png";

const blockList = reactive(Array<IBlockElement>());
const pathToPictures = "/img/streetplaner/";

export function useBlockList() {
    return {
        blockList: blockList,
        updateBlockList
    }
}

// fetches blocklist from backend (currently only frontend)
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
        blockList.splice(0, blockList.length);
        blockList.push(...[
            { groupId: 0, group: "Testobject1",id: 0,type:"???",name:"Gerade",rotation: 0,texture: (pathToPictures+"object-icons/Road_straight.svg")},
            { groupId: 0, group: "Testobject1",id: 1,type:"???",name:"Kurve",rotation: 0,texture: (pathToPictures+"object-icons/Road_curve.svg")},
            { groupId: 0, group: "Testobject2",id: 2,type:"???",name:"Kreuzung",rotation: 0,texture: (pathToPictures+"object-icons/Road_cross.svg")},
            { groupId: 1, group: "Testobject1", id: 3, type: "Building", name: "Big Building", rotation: 0, texture: BigBuilding },
            { groupId: 1, group: "Testobject2", id: 4, type: "Building", name: "Building", rotation: 0, texture: Building },
            { groupId: 1, group: "Testobject3", id: 5, type: "Building", name: "Markt", rotation: 0, texture: Supermarkt },
            { groupId: 1, group: "Testobject4", id: 6, type: "Building", name: "Stadium", rotation: 0, texture: Stadium }
        ]);
    }
}