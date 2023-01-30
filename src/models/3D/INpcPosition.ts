/**
 *interface for objects taht contain info bout the current pixelposition of npc
 *@param npcId id of the npc that these position infos belong to
 *@param npcPosX 3D x coordinate of npc position
 *@param npcPosZ 3D z coordinate of npc position
 *@param npcRotation rotation of the npc between 0 and 3 for intern navigation
 *@param npcViewRotation rotation value that is passed to GameView to display correct rotation
 */
export interface INpcPosition {
    npcId: number
    npcPosX: number
    npcPosZ: number
    npcRotation: number
    npcViewRotation?: number
}
