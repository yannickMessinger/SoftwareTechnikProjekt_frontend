import { reactive } from "vue"
import { IGridElement } from "./IGridElement"
import { IMapObject } from "./IMapObject"

const straightObjTypeId = 0
const curveObjTypeId = 1
const intersectionObjTypeId = 2
const straightRailObjTypeId = 9
const curveRailObjTypeId = 10
const trainStationObjTypeId = 11
const railRoadCrossObjTypeId = 12
const pedestrianCrossingObjTypeId = 8

let streetGrid: IGridElement[][]
let gridSizeX: number
let gridSizeY: number

export function useValidation() {
    return {
        checkStraightValid,
        checkCurveValid,
        checkIntersectionValid,
        checkCurveRailValid,
        checkRailRoadCrossingValid,
        checkStraightRailValid,
        initValidator,
    }
}

function initValidator(streetGridValue: IGridElement[][], gridSizeXValue: number, gridSizeYValue: number) {
    streetGrid = streetGridValue
    gridSizeX = gridSizeXValue
    gridSizeY = gridSizeYValue
}

function checkStraightValid(element: IMapObject): boolean {
    if (element.rotation % 2 == 0) {
        // check bottom
        if (!checkStreetBottom(element)) {
            return false
        }
        // check top
        if (!checkStreetTop(element)) {
            return false
        }
    } else {
        // check left
        if (!checkStreetLeft(element)) {
            return false
        }
        // check right
        if (!checkStreetRight(element)) {
            return false
        }
    }
    return true
}

function checkCurveValid(element: IMapObject): boolean {
    if (element.rotation === 0) {
        if (!checkStreetBottom(element)) {
            return false
        }
        if (!checkStreetRight(element)) {
            return false
        }
    } else if (element.rotation === 1) {
        if (!checkStreetBottom(element)) {
            return false
        }
        if (!checkStreetLeft(element)) {
            return false
        }
    } else if (element.rotation === 2) {
        if (!checkStreetLeft(element)) {
            return false
        }
        if (!checkStreetTop(element)) {
            return false
        }
    } else if (element.rotation === 3) {
        if (!checkStreetTop(element)) {
            return false
        }
        if (!checkStreetRight(element)) {
            return false
        }
    } else {
        return false
    }
    return true
}

function checkIntersectionValid(element: IMapObject): boolean {
    // check bottom
    if (!checkStreetBottom(element)) {
        return false
    }
    // check top
    if (!checkStreetTop(element)) {
        return false
    }
    // check left
    if (!checkStreetLeft(element)) {
        return false
    }
    // check right
    if (!checkStreetRight(element)) {
        return false
    }
    return true
}

function checkStraightRailValid(element: IMapObject): boolean {
    if (element.rotation % 2 === 0) {
        if (!checkRailTop(element)) {
            return false
        }
        if (!checkRailBottom(element)) {
            return false
        }
    } else {
        if (!checkRailLeft(element)) {
            return false
        }
        if (!checkRailRight(element)) {
            return false
        }
    }
    return true
}

function checkCurveRailValid(element: IMapObject): boolean {
    if (element.rotation === 0) {
        if (!checkRailBottom(element)) {
            return false
        }
        if (!checkRailRight(element)) {
            return false
        }
    } else if (element.rotation === 1) {
        if (!checkRailBottom(element)) {
            return false
        }
        if (!checkRailLeft(element)) {
            return false
        }
    } else if (element.rotation === 2) {
        if (!checkRailLeft(element)) {
            return false
        }
        if (!checkRailTop(element)) {
            return false
        }
    } else if (element.rotation === 3) {
        if (!checkRailTop(element)) {
            return false
        }
        if (!checkRailRight(element)) {
            return false
        }
    } else {
        return false
    }
    return true
}

function checkRailRoadCrossingValid(element: IMapObject): boolean {
    if (element.rotation % 2 === 0) {
        if (!checkRailLeft(element)) {
            return false
        }
        if (!checkRailRight(element)) {
            return false
        }
        if (!checkStreetTop(element)) {
            return false
        }
        if (!checkStreetBottom(element)) {
            return false
        }
    } else {
        if (!checkRailTop(element)) {
            return false
        }
        if (!checkRailBottom(element)) {
            return false
        }
        if (!checkStreetRight(element)) {
            return false
        }
        if (!checkStreetLeft(element)) {
            return false
        }
    }
    return true
}

function checkRailTop(element: IMapObject): boolean {
    let checkElement: IGridElement
    if (element.x - 1 >= 0) {
        checkElement = streetGrid[element.x - 1][element.y]
        if (checkElement.objectTypeId === -1) {
            return false
        } else if (
            checkElement.objectTypeId === straightRailObjTypeId ||
            checkElement.objectTypeId === trainStationObjTypeId
        ) {
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        } else if (checkElement.objectTypeId === curveRailObjTypeId) {
            if (checkElement.rotation === 2 || checkElement.rotation === 3) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            if (checkElement.rotation % 2 !== 1) {
                return false
            }
        }
    } else {
        return false
    }
    return true
}

function checkRailBottom(element: IMapObject): boolean {
    let checkElement: IGridElement
    if (element.x + 1 < gridSizeX) {
        checkElement = streetGrid[element.x + 1][element.y]
        if (checkElement.objectTypeId === -1) {
            return false
        } else if (
            checkElement.objectTypeId === straightRailObjTypeId ||
            checkElement.objectTypeId === trainStationObjTypeId
        ) {
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        } else if (checkElement.objectTypeId === curveRailObjTypeId) {
            if (checkElement.rotation === 0 || checkElement.rotation === 1) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            if (checkElement.rotation % 2 !== 1) {
                return false
            }
        }
    } else {
        return false
    }
    return true
}

function checkRailLeft(element: IMapObject): boolean {
    let checkElement: IGridElement
    if (element.y - 1 >= 0) {
        checkElement = streetGrid[element.x][element.y - 1]
        if (checkElement.objectTypeId === -1) {
            return false
        } else if (
            checkElement.objectTypeId === straightRailObjTypeId ||
            checkElement.objectTypeId === trainStationObjTypeId
        ) {
            if (checkElement.rotation % 2 !== 1) {
                return false
            }
        } else if (checkElement.objectTypeId === curveRailObjTypeId) {
            if (checkElement.rotation === 1 || checkElement.rotation === 2) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        }
    }
    return true
}

function checkRailRight(element: IMapObject): boolean {
    let checkElement: IGridElement
    if (element.y + 1 < gridSizeY) {
        checkElement = streetGrid[element.x][element.y + 1]
        if (checkElement.objectTypeId === -1) {
            return false
        } else if (
            checkElement.objectTypeId === straightRailObjTypeId ||
            checkElement.objectTypeId === trainStationObjTypeId
        ) {
            if (checkElement.rotation % 2 !== 1) {
                return false
            }
        } else if (checkElement.objectTypeId === curveRailObjTypeId) {
            if (checkElement.rotation === 0 || checkElement.rotation === 3) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        }
    }
    return true
}

function checkStreetTop(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check top
    if (element.x - 1 >= 0) {
        checkElement = streetGrid[element.x - 1][element.y]
        if (checkElement.objectTypeId === -1) {
            // invalid if checkElement is empty
            return false
        } else if (
            checkElement.objectTypeId === straightObjTypeId ||
            checkElement.objectTypeId === pedestrianCrossingObjTypeId
        ) {
            // invalid if checkElement is straight or crossing and isn't looking in the same direction as element
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        } else if (checkElement.objectTypeId === curveObjTypeId) {
            // invalid if checkElement is curve and isn't looking towards element
            if (checkElement.rotation >= 2) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        } else if (checkElement.objectTypeId !== intersectionObjTypeId) {
            // invalid if checkElement isn't a straight, curve or intersection
            return false
        }
    } else {
        // top element is out of bound
        return false
    }
    return true
}

function checkStreetBottom(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check bottom
    if (element.x + 1 < gridSizeX) {
        checkElement = streetGrid[element.x + 1][element.y]
        if (
            checkElement.objectTypeId === straightObjTypeId ||
            checkElement.objectTypeId === pedestrianCrossingObjTypeId
        ) {
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        } else if (checkElement.objectTypeId === curveObjTypeId) {
            // invalid if checkElement is curve and isn't looking towards element
            if (checkElement.rotation <= 1) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        } else if (checkElement.objectTypeId !== intersectionObjTypeId) {
            // invalid if checkElement isn't a straight, curve or intersection
            return false
        }
    } else {
        // bottom element is out of bound
        return false
    }
    return true
}

function checkStreetLeft(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check left
    if (element.y - 1 >= 0) {
        checkElement = streetGrid[element.x][element.y - 1]
        if (checkElement.objectTypeId === -1) {
            // invalid if checkElement is empty
            return false
        } else if (
            checkElement.objectTypeId === straightObjTypeId ||
            checkElement.objectTypeId === pedestrianCrossingObjTypeId
        ) {
            // invalid if checkElement is straight or crossing and isn't looking in the same direction as element
            if (checkElement.rotation % 2 !== 1) {
                return false
            }
        } else if (checkElement.objectTypeId === curveObjTypeId) {
            // invalid if checkElement is curve and isn't looking towards element
            if (checkElement.rotation === 1 || checkElement.rotation === 2) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            if (checkElement.rotation % 2 !== 1) {
                return false
            }
        } else if (checkElement.objectTypeId !== intersectionObjTypeId) {
            // invalid if checkElement isn't a straight, curve or intersection
            return false
        }
    } else {
        // left element is out of bound
        return false
    }
    return true
}

function checkStreetRight(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check right
    if (element.y + 1 < gridSizeY) {
        checkElement = streetGrid[element.x][element.y + 1]
        if (checkElement.objectTypeId === -1) {
            // invalid if checkElement is empty
            return false
        } else if (
            checkElement.objectTypeId === straightObjTypeId ||
            checkElement.objectTypeId === pedestrianCrossingObjTypeId
        ) {
            // invalid if checkElement is straight or crossing and isn't looking in the same direction as element
            if (checkElement.rotation % 2 !== 1) {
                return false
            }
        } else if (checkElement.objectTypeId === curveObjTypeId) {
            // invalid if checkElement is curve and isn't looking towards element
            if (checkElement.rotation === 0 || checkElement.rotation === 3) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            if (checkElement.rotation % 2 !== 1) {
                return false
            }
        } else if (checkElement.objectTypeId !== intersectionObjTypeId) {
            // invalid if checkElement isn't a straight, curve or intersection
            return false
        }
    } else {
        // right element is out of bound
        return false
    }
    return true
}
