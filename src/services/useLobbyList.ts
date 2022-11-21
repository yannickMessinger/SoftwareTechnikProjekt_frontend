/**
 *Data class to fetch and update the List of existing Lobbys 
 */

import { reactive, readonly } from "vue";
import { IAddLobbyRequestDTO } from "../typings/IAddLobbyRequestDTO";
import { ILobbyListItem } from "../typings/ILobbyListItem";
import {E_LobbyMode} from "../typings/E_LobbyMode";

export interface ILobbyListState {
    lobbylist: ILobbyListItem[]
    errormsg : string
    
}

const lobbyState = reactive<ILobbyListState>({
    lobbylist: Array<ILobbyListItem>(),
    errormsg:""
   
})



export function useLobbyList(){

    
    
    
    
    return {
        lobbyList: readonly(lobbyState), 
        updateLobbyList
    }


}

//functions to fetch and update LobbyState item
export async function updateLobbyList():Promise<void> {
    
    
    
    
    const url = '/api/lobby';
    
    
    try{
    

        const response = await fetch(url, {
            method: 'GET',
            
        })
    

        if (!response.ok) {

            lobbyState.errormsg = response.statusText;
            lobbyState.lobbylist = [];
            console.log("error in fetching lobbylist")
            throw new Error (response.statusText);
            
        }

       
        

        
        const jsondata : ILobbyListItem[] = await response.json();
        console.log("JSONDATA");
        console.log(jsondata)

    

        lobbyState.lobbylist = jsondata;
        lobbyState.errormsg = '';
           
            
        
            

            
        
    } catch(error){
        console.log(" error in updateLobbyList");
    }
    
    

}


export async function createNewLobby(addLobbyName:string, addNumOfPlayers: number, addLobbyMode: E_LobbyMode){

    const url = '/api/lobby';

    const testname = 'testname';
    const numOfPlayers = 17;

    const addLobby: IAddLobbyRequestDTO = ({lobbyName:addLobbyName, numOfPlayers:addNumOfPlayers, lobbyMode:addLobbyMode})
    //console.log(addLobby);
    
    
    try{

        const res = await fetch(url,{
            method:'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(addLobby)
        });

        console.log("added new Lobby");
       

    }catch (error){
        console.log(error)
    }


}






