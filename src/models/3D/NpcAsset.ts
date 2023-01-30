import { reactive } from "vue"
import { IMapObject } from "../Editor/IMapObject"
import { INpcPosition } from "./INpcPosition"

/**
 * parentclass for npc objects. contains logic for driving straight, driving curves and drive intersections.
 */
export class NpcAsset {
    public npcId: number
    public positions: INpcPosition
    public curMapObj: IMapObject
    public nextMapObj: IMapObject
    public fieldSize: number
    public mapLimit: number
    public gameAssetX: number
    public gameAssetZ: number
    public driving: boolean
    public needsMapEleUpdate: boolean
    public lastCarRotation: number
    public viewRotation: number
    public rotationMap: Map<number, number>
    public velocity: number
    public objectTypeId: number

    public curveRadius: number
    public curveCenterX: number
    public curveCenterZ: number
    public driveCurveRight: boolean
    public currCurveAngle: number
    public curveAngleInc: number

    constructor(
        npcId: number,
        objectTypeId: number,
        gameAssetX: number,
        gameAssetZ: number,
        npcRotation: number,
        fieldSize: number,
        curMapObj: IMapObject
    ) {
        this.npcId = npcId
        this.rotationMap = new Map([
            [0, Math.PI],
            [1, Math.PI / 2],
            [2, 0],
            [3, (3 * Math.PI) / 2],
        ])

        this.positions = reactive({
            npcId: this.npcId,
            npcPosX: gameAssetX,
            npcPosZ: gameAssetZ,
            npcRotation: npcRotation,
        })

        this.curMapObj = reactive({
            objectId: curMapObj.objectId,
            objectTypeId: curMapObj.objectTypeId,
            x: curMapObj.x,
            y: curMapObj.y,
            centerX3d: curMapObj.centerX3d,
            centerZ3d: curMapObj.centerZ3d,
            rotation: curMapObj.rotation,
            game_assets: curMapObj.game_assets,
        })

        this.nextMapObj = reactive({
            objectId: -1,
            objectTypeId: -1,
            x: -1,
            y: -1,
            centerX3d: -1,
            centerZ3d: -1,
            rotation: -1,
            game_assets: [],
        })

        this.velocity = 0.05
        this.objectTypeId = objectTypeId
        this.fieldSize = fieldSize
        this.mapLimit = 0
        this.gameAssetX = gameAssetX
        this.gameAssetZ = gameAssetZ
        this.driving = true
        this.needsMapEleUpdate = true
        this.lastCarRotation = this.positions.npcRotation

        this.viewRotation = this.rotationMap.get(this.positions.npcRotation) || 0

        this.curveRadius = 0
        this.curveCenterX = 0
        this.curveCenterZ = 0
        this.driveCurveRight = false
        this.currCurveAngle = 0.5
        this.curveAngleInc = 0.5

        this.calcNpcMapLimit()
    }

    /**
     * method to move the npc character. Differs between different mapobjects, such as straights, curves, intersections, traincrossings and
     * calls correct move method.
     */
    move() {
        if (
            this.curMapObj.objectTypeId === 0 ||
            this.curMapObj.objectTypeId === 12 ||
            this.curMapObj.objectTypeId === 9 ||
            this.curMapObj.objectTypeId === 11 ||
            this.curMapObj.objectTypeId === 8
        ) {
            this.moveStraight()
        } else if (this.curMapObj.objectTypeId === 1 || this.curMapObj.objectTypeId === 10) {
            this.moveCurve()
        } else if (this.curMapObj.objectTypeId === 2) {
            if (this.lastCarRotation === this.positions.npcRotation) {
                this.moveStraight()
            } else {
                this.moveCurve()
            }
        }
    }

    /**
     * method to move the npc on straights, depending on the orientation of the npc, velocity value gets added on the
     * corresponding coordinate to simulate movement.
     */
    moveStraight(): void {
        if (this.positions.npcRotation === 0) {
            this.positions.npcPosZ -= this.velocity
        } else if (this.positions.npcRotation === 1) {
            this.positions.npcPosX += this.velocity
        } else if (this.positions.npcRotation === 2) {
            this.positions.npcPosZ += this.velocity
        } else if (this.positions.npcRotation === 3) {
            this.positions.npcPosX -= this.velocity
        }
    }

    /**
     * method to move npc through curved street elements. Calls method to calculate coordinates (curve points) on the curve that
     * npc needs to be moved to and the corresponding angle of rotation that is passed to GameView. If npc passed the curve, it
     * needs a little push to cross mapObject limit and trigger update for the next one.
     */
    moveCurve(): void {
        if (
            !(
                this.currCurveAngle === 0 ||
                this.currCurveAngle === 90 ||
                this.currCurveAngle === 180 ||
                this.currCurveAngle === 270 ||
                this.currCurveAngle === 360
            )
        ) {
            this.calculateCurvePoints()
        } else {
            this.moveStraight()
        }
    }

    /**
     * method to calculate coordinates along the curve so that the npc is moved step by step, to make it move smoothly.
     * viewRotation is increased or decreased accordingly by 90 degrees and passed to GameView to show npc car turning steadily through curve.
     */
    calculateCurvePoints(): void {
        this.positions.npcPosX = this.curveCenterX + Math.cos((this.currCurveAngle * Math.PI) / 180) * this.curveRadius
        this.positions.npcPosZ = this.curveCenterZ - Math.sin((this.currCurveAngle * Math.PI) / 180) * this.curveRadius
        this.currCurveAngle += this.curveAngleInc

        if (this.driveCurveRight) {
            this.viewRotation -= 0.5 * (Math.PI / 180)
        } else {
            this.viewRotation += 0.5 * (Math.PI / 180)
        }
    }

    /**
     * Method that calculates the value of the map limit / border of the current mapObject that the npc is currently on.
     * If npc crosses that border, update is triggered for next mapObject.
     */
    calcNpcMapLimit(): void {
        if (this.positions.npcRotation === 0) {
            this.mapLimit = this.curMapObj.centerZ3d! - this.fieldSize / 2
        } else if (this.positions.npcRotation === 1) {
            this.mapLimit = this.curMapObj.centerX3d! + this.fieldSize / 2
        } else if (this.positions.npcRotation === 2) {
            this.mapLimit = this.curMapObj.centerZ3d! + this.fieldSize / 2
        } else if (this.positions.npcRotation === 3) {
            this.mapLimit = this.curMapObj.centerX3d! - this.fieldSize / 2
        }
    }

    /**
     *
     * @returns if npc has reached mapObject limit and needs position update from backend.
     * is called in a certain intervall of milliseconds to see if npc needs position update.
     */
    reachedMapEleLimit(): boolean | undefined {
        if (this.positions.npcRotation === 0) {
            if (this.positions.npcPosZ > this.mapLimit) {
                return false
            } else {
                this.needsMapEleUpdate = true
                return true
            }
        } else if (this.positions.npcRotation === 1) {
            if (this.positions.npcPosX < this.mapLimit) {
                return false
            } else {
                this.needsMapEleUpdate = true
                return true
            }
        } else if (this.positions.npcRotation === 2) {
            if (this.positions.npcPosZ < this.mapLimit) {
                return false
            } else {
                this.needsMapEleUpdate = true
                return true
            }
        } else if (this.positions.npcRotation === 3) {
            if (this.positions.npcPosX > this.mapLimit) {
                return false
            } else {
                this.needsMapEleUpdate = true
                return true
            }
        }
    }

    /**
     * method that calculates curve center and curve radius for driving curve of intersection and sets correct parameters
     * that are necessary to calculate correct curve points / coordinates.
     */
    calculateIntersection(): void {
        if (
            (this.lastCarRotation === 0 && this.positions.npcRotation === 1) ||
            (this.lastCarRotation === 3 && this.positions.npcRotation === 2)
        ) {
            this.curveCenterX = this.curMapObj.centerX3d! + this.fieldSize / 2
            this.curveCenterZ = this.curMapObj.centerZ3d! + this.fieldSize / 2

            if (this.lastCarRotation === 0) {
                this.driveCurveRight = true
                this.curveRadius = this.curveCenterX - this.positions.npcPosX
                this.currCurveAngle = 179.5
                this.curveAngleInc = -0.5
            } else {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 90.5
                this.curveAngleInc = 0.5
            }
        } else if (
            (this.lastCarRotation === 0 && this.positions.npcRotation === 3) ||
            (this.lastCarRotation === 1 && this.positions.npcRotation === 2)
        ) {
            this.curveCenterX = this.curMapObj.centerX3d! - this.fieldSize / 2
            this.curveCenterZ = this.curMapObj.centerZ3d! + this.fieldSize / 2

            if (this.lastCarRotation === 0) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 0.5
                this.curveAngleInc = 0.5
            } else {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 89.5
                this.curveAngleInc = -0.5
            }
        } else if (
            (this.lastCarRotation === 1 && this.positions.npcRotation === 0) ||
            (this.lastCarRotation === 2 && this.positions.npcRotation === 3)
        ) {
            this.curveCenterX = this.curMapObj.centerX3d! - this.fieldSize / 2
            this.curveCenterZ = this.curMapObj.centerZ3d! - this.fieldSize / 2

            if (this.lastCarRotation === 2) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 359.5
                this.curveAngleInc = -0.5
            } else {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 270.5
                this.curveAngleInc = 0.5
            }
        } else if (
            (this.lastCarRotation === 2 && this.positions.npcRotation === 1) ||
            (this.lastCarRotation === 3 && this.positions.npcRotation === 0)
        ) {
            this.curveCenterX = this.curMapObj.centerX3d! + this.fieldSize / 2
            this.curveCenterZ = this.curMapObj.centerZ3d! - this.fieldSize / 2

            if (this.lastCarRotation === 3) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 269.5
                this.curveAngleInc = -0.5
            } else {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 180.5
                this.curveAngleInc = 0.5
            }
        } else if (this.lastCarRotation === this.positions.npcRotation) {
            this.moveStraight()
        }
    }

    /**
     * calculates curve center point that rotation is executed around and radius of the curve.
     * also sets necessary parameters like curve angle and if angle needs to be increased or decreased.
     */
    calculateCurve(): void {
        if (this.curMapObj.rotation === 0) {
            this.curveCenterX = this.curMapObj.centerX3d! + this.fieldSize / 2
            this.curveCenterZ = this.curMapObj.centerZ3d! + this.fieldSize / 2

            if (this.lastCarRotation === 0) {
                this.driveCurveRight = true
                this.curveRadius = this.curveCenterX - this.positions.npcPosX
                this.currCurveAngle = 179.5
                this.curveAngleInc = -0.5
            } else if (this.lastCarRotation === 3) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 90.5
                this.curveAngleInc = 0.5
            }
        } else if (this.curMapObj.rotation === 1) {
            this.curveCenterX = this.curMapObj.centerX3d! - this.fieldSize / 2
            this.curveCenterZ = this.curMapObj.centerZ3d! + this.fieldSize / 2
            if (this.lastCarRotation === 1) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 89.5
                this.curveAngleInc = -0.5
            } else if (this.lastCarRotation === 0) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 0.5
                this.curveAngleInc = 0.5
            }
        } else if (this.curMapObj.rotation === 2) {
            this.curveCenterX = this.curMapObj.centerX3d! - this.fieldSize / 2
            this.curveCenterZ = this.curMapObj.centerZ3d! - this.fieldSize / 2
            if (this.lastCarRotation === 2) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 359.5
                this.curveAngleInc = -0.5
            } else if (this.lastCarRotation === 1) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 270.5
                this.curveAngleInc = 0.5
            }
        } else if (this.curMapObj.rotation === 3) {
            this.curveCenterX = this.curMapObj.centerX3d! + this.fieldSize / 2
            this.curveCenterZ = this.curMapObj.centerZ3d! - this.fieldSize / 2
            if (this.lastCarRotation === 3) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 269.5
                this.curveAngleInc = -0.5
            } else if (this.lastCarRotation === 2) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 180.5
                this.curveAngleInc = 0.5
            }
        }
    }

    /**
     *
     * @param npcPosX new x position that npc needs to be set to
     * @param npcPosZ new z position that npc needs to be set to
     * @param npcRotation rotation of the npc for intern logic
     * @param viewRotation rotation thst is passed to GameView and is displayed in 3d
     */
    setClientNpcPosition(npcPosX: number, npcPosZ: number, npcRotation: number, viewRotation: number) {
        this.positions.npcPosX = npcPosX
        this.positions.npcPosZ = npcPosZ
        this.positions.npcRotation = npcRotation
        this.viewRotation = viewRotation
    }
}
