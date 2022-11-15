import { reactive, readonly } from "vue";
import { ILobbyListItem } from "../typings/ILobbyListItem";

export interface ILobbyListState {
    lobbylist: ILobbyListItem[]
    errormsg : string
}

const lobbyState = reactive<ILobbyListState>({
    lobbylist: Array<ILobbyListItem>(),
    errormsg:""
})



export function useLobbyList(){

    lobbyState.lobbylist.push({name: "lobby1", gamemode: "build", player: 4});
    lobbyState.lobbylist.push({name: "lobby2", gamemode: "play", player: 7});
    lobbyState.lobbylist.push({name: "lobby3", gamemode: "build", player: 10});
    lobbyState.lobbylist.push({name: "lobby4", gamemode: "build", player: 4});
    
    
    
    return {
        lobbyList: readonly(lobbyState), 
        updateLobbyList
    }


}

export async function updateLobbyList():Promise<void> {
    

    

    const url = '/zugriffauf/backendrestpoint';
    

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
        lobbyState.lobbylist = jsondata;
        lobbyState.errormsg = '';
           
            
        
            

            
        
    } catch(error){
        console.log(" error in updateLobbyList");
    }
       

}






