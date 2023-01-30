/**
 * imports
 */
import { IGridElement } from "../../models/Editor/IGridElement"
import { IMapObject } from "../../models/Editor/IMapObject"

/**
 * define constants for objectTypeIds of the different elements
 */
const straightObjTypeId = 0
const curveObjTypeId = 1
const intersectionObjTypeId = 2
const straightRailObjTypeId = 9
const curveRailObjTypeId = 10
const trainStationObjTypeId = 11
const railRoadCrossObjTypeId = 12
const pedestrianCrossingObjTypeId = 8

/**
 * define variables used for the validation
 */
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

/**
 * initialize variable for the validation
 * @param streetGridValue - 2D Array of the street grid
 * @param gridSizeXValue - x gridSize of the street grid
 * @param gridSizeYValue - y gridSize of the street grid
 */
function initValidator(streetGridValue: IGridElement[][], gridSizeXValue: number, gridSizeYValue: number) {
    streetGrid = streetGridValue
    gridSizeX = gridSizeXValue
    gridSizeY = gridSizeYValue
}

/**
 * validate straight element
 * @param element - IMapObject to validate
 * @returns true if element is valid, otherwise false
 */
function checkStraightValid(element: IMapObject): boolean {
    // check rotation to find out which directions have to be checked
    if (element.rotation % 2 == 0) {
        if (!checkStreetBottom(element)) {
            return false
        }
        if (!checkStreetTop(element)) {
            return false
        }
    } else {
        if (!checkStreetLeft(element)) {
            return false
        }
        if (!checkStreetRight(element)) {
            return false
        }
    }
    return true
}

/**
 * validate curve element
 * @param element - IMapObject to validate
 * @returns true if element is valid, otherwise false
 */
function checkCurveValid(element: IMapObject): boolean {
    // check rotation to find out which directions have to be checked
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

/**
 * validate intersection element
 * @param element - IMapObject to validate
 * @returns true if element is valid, otherwise false
 */
function checkIntersectionValid(element: IMapObject): boolean {
    // validate all directions
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

/**
 * validate straight rail element
 * @param element - IMapObject to validate
 * @returns true if element is valid, otherwise false
 */
function checkStraightRailValid(element: IMapObject): boolean {
    // check rotation to find out which directions have to be checked
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

/**
 * validate curve rail element
 * @param element - IMapObject to validate
 * @returns true if element is valid, otherwise false
 */
function checkCurveRailValid(element: IMapObject): boolean {
    // check rotation to find out which directions have to be checked
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

/**
 * validate railroad crossing element
 * @param element - IMapObject to validate
 * @returns true if element is valid, otherwise false
 */
function checkRailRoadCrossingValid(element: IMapObject): boolean {
    // check rotation to find out which directions have to be checked
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

/**
 * checks if the cell on top of element is a valid rail
 * @param element - element to check the top of
 * @returns true if element on top is valid, otherwise false
 */
function checkRailTop(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check if top is out of index
    if (element.x - 1 >= 0) {
        checkElement = streetGrid[element.x - 1][element.y]
        // check if top is empty
        if (checkElement.objectTypeId === -1) {
            return false
        } else if (
            checkElement.objectTypeId === straightRailObjTypeId ||
            checkElement.objectTypeId === trainStationObjTypeId
        ) {
            // if top is straight or train station
            if (checkElement.rotation % 2 !== 0) {
                // check if top is placed towards element
                return false
            }
        } else if (checkElement.objectTypeId === curveRailObjTypeId) {
            // if top is curve
            if (checkElement.rotation === 2 || checkElement.rotation === 3) {
                // check if top is placed towards element
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            // if top is railRoadCross
            if (checkElement.rotation % 2 !== 1) {
                // check if top is placed towards element
                return false
            }
        }
    } else {
        return false
    }
    return true
}

/**
 * checks if the cell at the bottom of element is a valid rail
 * @param element - element to check the bottom of
 * @returns true if element at the bottom is valid, otherwise false
 */
function checkRailBottom(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check if bottom is out of index
    if (element.x + 1 < gridSizeX) {
        checkElement = streetGrid[element.x + 1][element.y]
        // check if bottom is empty
        if (checkElement.objectTypeId === -1) {
            return false
        } else if (
            checkElement.objectTypeId === straightRailObjTypeId ||
            checkElement.objectTypeId === trainStationObjTypeId
        ) {
            // if bottom is straight or train station
            if (checkElement.rotation % 2 !== 0) {
                // check if bottom is placed towards element
                return false
            }
        } else if (checkElement.objectTypeId === curveRailObjTypeId) {
            // if bottom is curve
            if (checkElement.rotation === 0 || checkElement.rotation === 1) {
                // check if bottom is placed towards element
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            // if bottom is railRoadCross
            if (checkElement.rotation % 2 !== 1) {
                // check if bottom is placed towards element
                return false
            }
        }
    } else {
        return false
    }
    return true
}

/**
 * checks if the cell on the left of element is a valid rail
 * @param element - element to check the left of
 * @returns true if element on the left is valid, otherwise false
 */
function checkRailLeft(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check if left is out of index
    if (element.y - 1 >= 0) {
        checkElement = streetGrid[element.x][element.y - 1]
        // check if left is empty
        if (checkElement.objectTypeId === -1) {
            return false
        } else if (
            checkElement.objectTypeId === straightRailObjTypeId ||
            checkElement.objectTypeId === trainStationObjTypeId
        ) {
            // if left is straight or train station
            if (checkElement.rotation % 2 !== 1) {
                // check if left is placed towards element
                return false
            }
        } else if (checkElement.objectTypeId === curveRailObjTypeId) {
            // if left is curve
            if (checkElement.rotation === 1 || checkElement.rotation === 2) {
                // check if left is placed towards element
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            // if left is railRoadCross
            if (checkElement.rotation % 2 !== 0) {
                // check if left is placed towards element
                return false
            }
        }
    }
    return true
}

/**
 * checks if the cell on the right of element is a valid rail
 * @param element - element to check the right of
 * @returns true if element on the right is valid, otherwise false
 */
function checkRailRight(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check if right is out of index
    if (element.y + 1 < gridSizeY) {
        checkElement = streetGrid[element.x][element.y + 1]
        // check if right is empty
        if (checkElement.objectTypeId === -1) {
            return false
        } else if (
            checkElement.objectTypeId === straightRailObjTypeId ||
            checkElement.objectTypeId === trainStationObjTypeId
        ) {
            // if right is straight or train station
            if (checkElement.rotation % 2 !== 1) {
                // check if right is placed towards element
                return false
            }
        } else if (checkElement.objectTypeId === curveRailObjTypeId) {
            // if right is curve
            if (checkElement.rotation === 0 || checkElement.rotation === 3) {
                // check if right is placed towards element
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            // if right is railRoadCross
            if (checkElement.rotation % 2 !== 0) {
                // check if right is placed towards element
                return false
            }
        }
    }
    return true
}

/**
 * checks if the cell on top of element is a valid street
 * @param element - element to check the top of
 * @returns true if element on top is valid, otherwise false
 */
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
            // invalid if checkElement is railRoadCross and isn't looking in the same direction as element
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

/**
 * checks if the cell at the bottom of element is a valid street
 * @param element - element to check the bottom of
 * @returns true if element at the bottom is valid, otherwise false
 */
function checkStreetBottom(element: IMapObject): boolean {
    let checkElement: IGridElement
    // check bottom
    if (element.x + 1 < gridSizeX) {
        checkElement = streetGrid[element.x + 1][element.y]
        if (
            checkElement.objectTypeId === straightObjTypeId ||
            checkElement.objectTypeId === pedestrianCrossingObjTypeId
        ) {
            // invalid if checkElement is straight or crossing and isn't looking in the same direction as element
            if (checkElement.rotation % 2 !== 0) {
                return false
            }
        } else if (checkElement.objectTypeId === curveObjTypeId) {
            // invalid if checkElement is curve and isn't looking towards element
            if (checkElement.rotation <= 1) {
                return false
            }
        } else if (checkElement.objectTypeId === railRoadCrossObjTypeId) {
            // invalid if checkElement is railRoadCross and isn't looking in the same direction as element
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

/**
 * checks if the cell on the left of element is a valid street
 * @param element - element to check the left of
 * @returns true if element on the left is valid, otherwise false
 */
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
            // invalid if checkElement is railRoadCross and isn't looking in the same direction as element
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

/**
 * checks if the cell on the right of element is a valid street
 * @param element - element to check the right of
 * @returns true if element on the right is valid, otherwise false
 */
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
            // invalid if checkElement is railRoadCross and isn't looking in the same direction as element
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
