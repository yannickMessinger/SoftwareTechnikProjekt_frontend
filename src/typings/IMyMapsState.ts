import { IMyMapsListItem } from "./IMyMapsListitem"
import { IMapDTO } from "./IMapDTO"

export interface IMyMapsState {
    mapslist: IMapDTO[]
    errormsg: string
}
