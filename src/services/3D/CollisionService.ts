import * as THREE from "three"

export class CollisionService {
    public car: any
    public carBB: any

    //BB is Bounding Box
    constructor(car: any) {
        this.car = car
        this.carBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    }

    updateCarBoundingBox() {
        if(this.car.value != null){
            this.carBB.setFromObject(this.car.value.mesh)
        }
    }

    checkCollision(objects: { id: number; box: THREE.Box3 }[]): boolean {
        if (objects.length == 0) {
            return false
        } else {
            for (let i = 0; i < objects.length; i++) {
                if (this.carBB.intersectsBox(objects[i].box)) {
                    console.log("Collision detected with:", objects[i].id)
                    return true
                }
            }
            return false
        }
    }
}
