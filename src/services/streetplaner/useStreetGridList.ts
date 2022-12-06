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
        let json = '{"Strassenobjekte":[]}';
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
