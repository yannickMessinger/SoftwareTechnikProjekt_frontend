import { reactive } from "vue";
import { IStreetElement } from "./IStreetElement";
import { StreetGridDTO } from "./StreetGridDTO";

const streetGridDTO = reactive({ Strassenobjekte: Array<IStreetElement>() });

export function useStreetGridList() {
    return {
        streetGridDTO: streetGridDTO,
        updateStreetGridList
    }
}

export async function updateStreetGridList() {
    const url = "api/mapobject";

    try {
        // Todo, get map from backend
        throw new Error();
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
    }
    catch {
        let json = '{"Strassenobjekte":[{"Objekt_ID":1,"X":0,"Y":0,"Rotation":0},{"Objekt_ID":0,"X":0,"Y":1,"Rotation":1},{"Objekt_ID":0,"X":0,"Y":2,"Rotation":1},{"Objekt_ID":1,"X":0,"Y":3,"Rotation":1},{"Objekt_ID":0,"X":1,"Y":0,"Rotation":2},{"Objekt_ID":0,"X":1,"Y":3,"Rotation":2},{"Objekt_ID":1,"X":1,"Y":6,"Rotation":0},{"Objekt_ID":0,"X":1,"Y":7,"Rotation":3},{"Objekt_ID":1,"X":1,"Y":8,"Rotation":1},{"Objekt_ID":0,"X":2,"Y":0,"Rotation":2},{"Objekt_ID":1,"X":2,"Y":2,"Rotation":0},{"Objekt_ID":2,"X":2,"Y":3,"Rotation":0},{"Objekt_ID":0,"X":2,"Y":4,"Rotation":3},{"Objekt_ID":0,"X":2,"Y":5,"Rotation":3},{"Objekt_ID":1,"X":2,"Y":6,"Rotation":2},{"Objekt_ID":0,"X":2,"Y":8,"Rotation":0},{"Objekt_ID":0,"X":3,"Y":0,"Rotation":0},{"Objekt_ID":0,"X":3,"Y":2,"Rotation":0},{"Objekt_ID":0,"X":3,"Y":3,"Rotation":2},{"Objekt_ID":0,"X":3,"Y":8,"Rotation":0},{"Objekt_ID":0,"X":4,"Y":0,"Rotation":0},{"Objekt_ID":0,"X":4,"Y":2,"Rotation":0},{"Objekt_ID":0,"X":4,"Y":3,"Rotation":2},{"Objekt_ID":0,"X":4,"Y":8,"Rotation":0},{"Objekt_ID":1,"X":5,"Y":0,"Rotation":3},{"Objekt_ID":0,"X":5,"Y":1,"Rotation":1},{"Objekt_ID":1,"X":5,"Y":2,"Rotation":2},{"Objekt_ID":0,"X":5,"Y":3,"Rotation":2},{"Objekt_ID":1,"X":5,"Y":7,"Rotation":0},{"Objekt_ID":1,"X":5,"Y":8,"Rotation":2},{"Objekt_ID":1,"X":6,"Y":3,"Rotation":3},{"Objekt_ID":0,"X":6,"Y":4,"Rotation":3},{"Objekt_ID":0,"X":6,"Y":5,"Rotation":3},{"Objekt_ID":0,"X":6,"Y":6,"Rotation":3},{"Objekt_ID":1,"X":6,"Y":7,"Rotation":2}]}';
        streetGridDTO.Strassenobjekte = JSON.parse(json).Strassenobjekte;
    }
}

export async function postStreetGrid(dto: StreetGridDTO) {
    const url = "/api/mapobject";
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        let data = await response.json();
        let id = data.length;
        console.log(dto);
        response = await fetch(url + '/1', { 
            method: 'POST',
            body: JSON.stringify(dto),
            headers: {'Content-Type': 'application/json; charset=UTF-8' }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        console.log(response.body);
    } 
    catch (error) {
        console.log(error);
    }
}
