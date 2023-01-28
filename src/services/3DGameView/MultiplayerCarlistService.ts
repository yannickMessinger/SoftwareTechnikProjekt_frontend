import * as THREE from "three"
import { useCarMultiplayer } from "./useCarMultiplayer"

const { positionState, playerCarState } = useCarMultiplayer()

export class MultiplayerCarlistService {
    public playerObjectMap: Map<any, any>
    public rawPlayerList: any

    constructor(rawPlayerList: any) {
        this.playerObjectMap = new Map()
        this.rawPlayerList = rawPlayerList
    }

    getPlayerObjectMap(): Map<any, any> {
        return this.playerObjectMap
    }

    loadPlayerObjectMap(sceneChildren: any) {
        sceneChildren.forEach((object: any) => {
            this.rawPlayerList.forEach((player: any) => {
                if (object.name === `player_${player.userId}`) {
                    this.playerObjectMap.set(player.userId, object)
                }
            })
        })
    }
    updatePlayerCars(playerCarList: any, positionState: any, uid: any) {
        playerCarList.value.forEach((ele: any) => {
            positionState.mapObjects.forEach((positionEle: any) => {
                if (ele.playerCarId !== uid && positionEle.id === ele.playerCarId) {
                    ele.playerCarX = positionEle.x
                    ele.playerCarZ = positionEle.z
                    ele.playerCarRotation
                    let x = this.playerObjectMap.get(positionEle.id)
                    if (x != undefined) {
                        x.setRotationFromEuler(
                            new THREE.Euler(
                                positionEle.rotation._x,
                                positionEle.rotation._y,
                                positionEle.rotation._z,
                                positionEle.rotation.order
                            )
                        )
                    }
                }
            })
        })
    }
}
