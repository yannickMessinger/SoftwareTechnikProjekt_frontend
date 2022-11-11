/** 
 * author: Sean Dittmann
 * date: 11.11.2022
 * 
 * ToolElement - Tool Element displayed in the toolList area in the steet planer view. (Like Dozer, place objects, rotate objects, etc) 
 * id - Id of this tool (useful Id system needs to be invented later)
 * name - name of the tool which is displayed in the list
 * texture - path for the displayed picture
 */

export interface IToolElement {
    id: number,
    name: string,
    texture: string
}