import {reactive, readonly} from "vue";
import {IGridElement} from "./IGridElement";

export function useStreetGrid() {


    interface IGridState {
        playerGrid: IGridElement[][],
        errorMsg: string

        //playerName: string,
        //lobby noch?? 
    }


    const gridState = reactive<IGridState>({
        playerGrid: Array(1).fill([]).map(() => Array(1).fill(null)),
        errorMsg: ''
    });

    
    function extractElements(){
        let test: IGridElement[] = [];

        gridState.playerGrid.forEach((zeile) => {
            zeile.forEach((spalte) => {
                if (spalte.texture !== ""){
                    test.push(spalte);
                }
            })
        })

        console.log(JSON.stringify({"filledArray":test, "width" : gridState.playerGrid[0].length, "height": gridState.playerGrid.length}));
        
      let test2 : IGridElement[][] = gridState.playerGrid.map((ele) => {
            return ele.filter((ele) =>{
                return ele.texture !== ""
            })
      })

      

    }


    function setGridState(setGrid: IGridElement[][]) {
        //console.log("setGridState");
        gridState.playerGrid = setGrid;
      
    }

    async function saveStreetGrid(): Promise<void> {
        const url = '/api/streetgrid';

        const filledGridCells: IGridElement[] = [];

        gridState.playerGrid.forEach((zeile) => {
            zeile.forEach((spalte) => {
                if (spalte.texture !== ""){
                    filledGridCells.push(spalte);
                }
            })
        })

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"filledArray":filledGridCells, "width" : gridState.playerGrid[0].length, "height": gridState.playerGrid.length})
            })

            if (!response.ok) {
                gridState.errorMsg = response.statusText;
                throw new Error(response.statusText);
            }

            gridState.errorMsg = '';
            console.log("saved streetgrid");

        } catch (error) {
            console.log('error save streetgrid')
        }
    }




    return {
        gridState: readonly(gridState),
        saveStreetGrid,
        setGridState,
        extractElements
        
    }
}