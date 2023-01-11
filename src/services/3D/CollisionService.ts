import * as THREE from "three"

export class CollisionService {
    public car: any
    public objects: any
    public shop: any
    public carBB: any

    //BB is Bounding Box
    constructor(car: any, objects: any, shop: any) {
        this.car = car
        this.objects = objects
        this.shop = shop
        this.carBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    }

    updateCarBoundingBox(car: any) {
        this.carBB.setFromObject(this.car.value.mesh)
    }

    checkCollision(scene: any): boolean {
        console.log(scene.value.scene)
        let boxBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        boxBB.setFromObject(this.objects.value.mesh)

        let shopBB = new THREE.Box3().setFromObject(this.shop.value.o3d)

        if (this.carBB.intersectsBox(boxBB)) {
            return true
        } else if (this.carBB.intersectsBox(shopBB)) {
            return true
        } else {
            return false
        }
    }
}
