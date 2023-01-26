/**
 *
 * ToolElement - Tool Element displayed in the toolList area in the steet planer view. (Like Dozer, place objects, rotate objects, etc)
 * id - Id of this tool (useful Id system needs to be invented later)
 * name - name of the tool which is displayed in the list
 * texture - path for the displayed picture
 */

import { TypesConfig } from "vue-router"
import ToolEnum from "./ToolEnum"
export interface IToolElement {
    tool: string
    id: number
    name: string
    texture: string
}
