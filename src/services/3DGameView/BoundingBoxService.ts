import * as THREE from "three"

export class BoundingBoxService {
    public objects: any[]
    public boundingBoxes: { id: number; box: THREE.Box3 }[]
    public relevantIds: any[]

    constructor() {
        this.objects = []
        this.boundingBoxes = []
        this.relevantIds = []
    }

    getBoundingBoxes(): { id: number; box: THREE.Box3 }[] {
        return this.boundingBoxes
    }

    setObjects(scene: any): void {
        this.objects.push(...scene.value.scene.children)
        this.init()
        this.createBoundingBox()
    }

    init() {
        this.relevantIds.push(3)
        this.relevantIds.push(4)
        this.relevantIds.push(5)
        // this.relevantIds.push(17) - environment
        // this.relevantIds.push(18) - environment
        // this.relevantIds.push(19) - environment
        // this.relevantIds.push(20) - environment
        this.relevantIds.push(21)
        this.relevantIds.push(22)
    }

    createBoundingBox() {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.relevantIds.includes(this.objects[i].name)) {
                let newBB: THREE.Box3 = new THREE.Box3().setFromObject(this.objects[i])
                this.boundingBoxes.push({ id: this.objects[i].name, box: newBB })
            }
        }
    }
}
