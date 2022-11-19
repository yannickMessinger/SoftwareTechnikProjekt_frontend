import { reactive, readonly } from "vue";
import { IGridElement } from "./IGridElement";

export function useStreetGrid( ) {
    
    

    interface IGridState {
        playerGrid: IGridElement[][],
        errorMsg: string
        
        //playerName: string,
        //lobby noch?? 
    }



    const gridState = reactive<IGridState>({playerGrid: Array(1).fill([]).map(() => Array(1).fill(null)), errorMsg:''});


    function setGridState(setGrid:IGridElement[][]){
        console.log("setGridState");
        gridState.playerGrid = setGrid;
    }
    
    

    async function saveStreetGrid():Promise<void> {
        

        const url = '/api/streetgrid';
       
        
        try{

            const response = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(gridState.playerGrid)
            })


            if (!response.ok) {
                
                gridState.errorMsg = response.statusText;
                throw new Error (response.statusText);
            }

            gridState.errorMsg ='';
           
            console.log("saved streetgrid");

        
        }catch(error){
            console.log('error save streetgrid')
        }




    }


    function showGridState(){
        console.log("showGridState");
        console.log(JSON.stringify(gridState.playerGrid));
    }

    function parseStreetGrid(){

    }

    
    return {
        gridState: readonly(gridState),
        saveStreetGrid,
        setGridState,
        showGridState
    }
}