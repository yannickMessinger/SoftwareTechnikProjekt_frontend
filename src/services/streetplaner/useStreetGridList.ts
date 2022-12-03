import { reactive } from "vue";
import { IStreetElement } from "./IStreetElement";

const streetGridList = reactive(Array<IStreetElement>());

export function useStreetGridList() {
    return {
        streetGridList: streetGridList,
        updateStreetGridList
    }
}

export async function updateStreetGridList() {
    const url = "api/map/12";

    try {
        // Todo, get map from backend
        throw new Error();
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
    }
    catch {
        // Todo, load from json format
        streetGridList.splice(0, streetGridList.length);
        streetGridList.push(...[
            { Objekt_ID: 1, X: 0, Y: 0, Rotation: 0 },
            { Objekt_ID: 0, X: 1, Y: 0, Rotation: 0 },
            { Objekt_ID: 0, X: 0, Y: 1, Rotation: 0 },
            { Objekt_ID: 2, X: 0, Y: 2, Rotation: 0 },
            { Objekt_ID: 2, X: 2, Y: 3, Rotation: 0 },
            { Objekt_ID: 1, X: 3, Y: 5, Rotation: 0 },
            { Objekt_ID: 0, X: 6, Y: 3, Rotation: 0 },
            { Objekt_ID: 0, X: 7, Y: 7, Rotation: 0 }
        ]);
    }
}
