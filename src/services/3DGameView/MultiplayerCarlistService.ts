import * as THREE from "three"
import { useCarMultiplayer } from './useCarMultiplayer';
const {
    positionState,
    playerCarState,
} = useCarMultiplayer()

export class MultiplayerCarlistService {
    public playerObjectMap: Map<any, any>;
    public rawPlayerList:any

    constructor(rawPlayerList: any){
        this.playerObjectMap = new Map;
        this.rawPlayerList = rawPlayerList
    }

    loadPlayerObjectMap(sceneChildren: any){
        console.log("RawPlayList: ", this.rawPlayerList)
        console.log("Scene Children: ", sceneChildren)
        sceneChildren.forEach((object: any) => {
           this.rawPlayerList.forEach((player:any)=> {
                if(object.name === `player_${player.userId}`){
                    this.playerObjectMap.set(player.userId, object)
                }
           })
        });
        console.log("Player Map:", this.playerObjectMap)
    }
    updatePlayerCars(playerCarList: any, positionState:any, uid:any){
        playerCarList.value.forEach((ele:any) => {
            positionState.mapObjects.forEach((positionEle:any) => {
                if (ele.playerCarId !== uid && positionEle.id === ele.playerCarId) {
                    //let rotationValue = positionEle.rotation * Math.PI
                    ele.playerCarX = positionEle.x
                    ele.playerCarZ = positionEle.z
                    ele.playerCarRotation
                    //scene3DobjectMap.get(positionEle.id).setRotationFromEuler(new THREE.Euler( positionEle.rotation ))
                    let x = this.playerObjectMap.get(positionEle.id)
                    //x.rotation = positionEle.rotation
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