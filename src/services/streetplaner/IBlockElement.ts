/**
 * author: Sean Dittmann
 * date: 11.11.2022
 *
 * BlockElement - Block Element of streetplaner list for streetplaner blocks (like sraight, cross or curve block).
 * groupId - categoryId for the list like street or railway (useful Id system needs to be invented later)
 * group - text for category like street or railway
 * id - Id of this block (useful Id system needs to be invented later)
 * type - fill text, maybe useful later or should be deleted later
 * name - name of this block which is displayed in the list
 * rotation - rotates clockwise 0(default) - 1 (90 degrees) - 2 (180 degrees) - 3 (270 degrees) - 0
 * texture - path for the displayed picture
 */

export interface IBlockElement {
    groupId: number
    group: string
    id: number
    type: string
    name: string
    rotation: number
    texture: string
}
