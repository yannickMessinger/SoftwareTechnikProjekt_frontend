import * as THREE from "three"

export class BoundingBoxService {
    public objects: any[]
    public boundingBoxes: { id: number; box: THREE.Box3 }[]
    public relevantIds: number[]

    constructor() {
        this.objects = []
        this.boundingBoxes = []
        this.relevantIds = []
    }

    getBoundingBoxes(): { id: number; box: THREE.Box3 }[] {
        return this.boundingBoxes
    }

    /**
     * Saving the referenz of all children of the scene
     * @param scene Scene from Trois.js/THREE.js in order to receive all loaded GLTF models
     */
    setObjects(scene: any): void {
        this.objects.push(...scene.value.scene.children)
        this.init()
        this.createBoundingBox()
    }

    /**
     * Adds all object Ids to an array which will be used to determine which objects can be collisioned with
     */
    init() {
        this.relevantIds.push(3)
        this.relevantIds.push(4)
        this.relevantIds.push(5)
        // this.relevantIds.push(17) - environment
        // this.relevantIds.push(18) - environment
        // this.relevantIds.push(19) - environment
        // this.relevantIds.push(20) - environment
        //this.relevantIds.push(21) - NPC car
        //this.relevantIds.push(22) - NPC car
    }

    /**
     * Creating and saving the relevant BoundingBoxes objects which are needed for collision detection
     */
    createBoundingBox() {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.relevantIds.includes(this.objects[i].name)) {
                let newBB: THREE.Box3 = new THREE.Box3().setFromObject(this.objects[i])
                this.boundingBoxes.push({ id: this.objects[i].name, box: newBB })
            }
        }
    }
}
