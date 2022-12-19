import { reactive, ref } from "vue";
import { IMapObject } from "../streetplaner/IMapObject";
import useUser from "../UserStore";
const { activeLobby } = useUser();
const mapWidth = ref();
const mapHeight = ref();

const gameState = reactive({
  gameMapObjects: Array<IMapObject>(),
  mapObjsFromBackEnd: Array<IMapObject>(),
  init: false,
});

export function setMapWidthAndMapHeight(width: number, height: number) {
  mapWidth.value = width;
  mapHeight.value = height;
}

export function useGameView() {
  return {
    gameState,
    resetGameMapObjects,
    resetMapObjsFromBackEnd,
    fillGameState,
    updateMapObjsFromGameState,
    setMapWidthAndMapHeight,
  };
}

export async function updateMapObjsFromGameState() {
  const url = "/api/map/objects";
  const mapId = activeLobby.value.mapId;

  try {
    if (mapId === -1) {
      throw new Error("mapID is -1, make sure you are in a lobby.");
    }
    const response = await fetch(`${url}/${mapId}`, { method: "GET" });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const jsondata = await response.json();
    gameState.mapObjsFromBackEnd = jsondata;
    fillGameState();
  } catch (error: any) {
    console.log(error.statusText);
    let json =
      '{"mapObjects":[{"objectTypeId":1,"x":2,"y":9,"rotation":0},{"objectTypeId":0,"x":2,"y":10,"rotation":1},{"objectTypeId":0,"x":2,"y":11,"rotation":1},{"objectTypeId":0,"x":2,"y":12,"rotation":1},{"objectTypeId":0,"x":2,"y":13,"rotation":1},{"objectTypeId":0,"x":2,"y":14,"rotation":1},{"objectTypeId":1,"x":2,"y":15,"rotation":1},{"objectTypeId":0,"x":3,"y":9,"rotation":0},{"objectTypeId":6,"x":3,"y":14,"rotation":0},{"objectTypeId":0,"x":3,"y":15,"rotation":2},{"objectTypeId":0,"x":4,"y":9,"rotation":0},{"objectTypeId":1,"x":4,"y":12,"rotation":0},{"objectTypeId":0,"x":4,"y":13,"rotation":1},{"objectTypeId":0,"x":4,"y":14,"rotation":1},{"objectTypeId":1,"x":4,"y":15,"rotation":2},{"objectTypeId":0,"x":5,"y":9,"rotation":0},{"objectTypeId":0,"x":5,"y":12,"rotation":2},{"objectTypeId":0,"x":6,"y":9,"rotation":0},{"objectTypeId":5,"x":6,"y":10,"rotation":0},{"objectTypeId":0,"x":6,"y":12,"rotation":2},{"objectTypeId":1,"x":7,"y":5,"rotation":0},{"objectTypeId":0,"x":7,"y":6,"rotation":1},{"objectTypeId":0,"x":7,"y":7,"rotation":1},{"objectTypeId":0,"x":7,"y":8,"rotation":1},{"objectTypeId":2,"x":7,"y":9,"rotation":0},{"objectTypeId":0,"x":7,"y":10,"rotation":1},{"objectTypeId":0,"x":7,"y":11,"rotation":1},{"objectTypeId":1,"x":7,"y":12,"rotation":2},{"objectTypeId":1,"x":7,"y":14,"rotation":0},{"objectTypeId":0,"x":7,"y":15,"rotation":1},{"objectTypeId":0,"x":7,"y":16,"rotation":1},{"objectTypeId":1,"x":7,"y":17,"rotation":1},{"objectTypeId":0,"x":8,"y":5,"rotation":2},{"objectTypeId":3,"x":8,"y":8,"rotation":0},{"objectTypeId":0,"x":8,"y":9,"rotation":2},{"objectTypeId":3,"x":8,"y":10,"rotation":0},{"objectTypeId":0,"x":8,"y":14,"rotation":2},{"objectTypeId":0,"x":8,"y":17,"rotation":0},{"objectTypeId":0,"x":9,"y":5,"rotation":2},{"objectTypeId":4,"x":9,"y":8,"rotation":0},{"objectTypeId":0,"x":9,"y":9,"rotation":2},{"objectTypeId":3,"x":9,"y":10,"rotation":0},{"objectTypeId":0,"x":9,"y":14,"rotation":2},{"objectTypeId":0,"x":9,"y":17,"rotation":0},{"objectTypeId":0,"x":10,"y":5,"rotation":2},{"objectTypeId":4,"x":10,"y":8,"rotation":0},{"objectTypeId":0,"x":10,"y":9,"rotation":2},{"objectTypeId":0,"x":10,"y":14,"rotation":2},{"objectTypeId":0,"x":10,"y":17,"rotation":0},{"objectTypeId":1,"x":11,"y":5,"rotation":3},{"objectTypeId":0,"x":11,"y":6,"rotation":1},{"objectTypeId":0,"x":11,"y":7,"rotation":1},{"objectTypeId":0,"x":11,"y":8,"rotation":1},{"objectTypeId":2,"x":11,"y":9,"rotation":0},{"objectTypeId":0,"x":11,"y":10,"rotation":1},{"objectTypeId":0,"x":11,"y":11,"rotation":1},{"objectTypeId":0,"x":11,"y":12,"rotation":1},{"objectTypeId":0,"x":11,"y":13,"rotation":1},{"objectTypeId":2,"x":11,"y":14,"rotation":0},{"objectTypeId":0,"x":11,"y":15,"rotation":1},{"objectTypeId":0,"x":11,"y":16,"rotation":1},{"objectTypeId":1,"x":11,"y":17,"rotation":2},{"objectTypeId":0,"x":12,"y":9,"rotation":0},{"objectTypeId":0,"x":12,"y":14,"rotation":0},{"objectTypeId":0,"x":13,"y":9,"rotation":0},{"objectTypeId":0,"x":13,"y":14,"rotation":0},{"objectTypeId":1,"x":14,"y":9,"rotation":3},{"objectTypeId":0,"x":14,"y":10,"rotation":1},{"objectTypeId":0,"x":14,"y":11,"rotation":1},{"objectTypeId":0,"x":14,"y":12,"rotation":1},{"objectTypeId":0,"x":14,"y":13,"rotation":1},{"objectTypeId":1,"x":14,"y":14,"rotation":2}]}';
    gameState.mapObjsFromBackEnd = JSON.parse(json).mapObjects;
  }
}

export function resetGameMapObjects() {
  gameState.gameMapObjects.splice(0, gameState.gameMapObjects.length);
}

export function resetMapObjsFromBackEnd() {
  gameState.mapObjsFromBackEnd.splice(0, gameState.mapObjsFromBackEnd.length);
}

function randomNumer(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function fillGameState(): void {
  let counter = 0;
  for (let i = 0; i < mapWidth.value; i++) {
    for (let j = 0; j < mapHeight.value; j++) {
      gameState.gameMapObjects[counter] = {
        objectTypeId: randomNumer(17, 20),
        x: i,
        y: j,
        rotation: randomNumer(0, 3),
      };
      counter += 1;
    }
  }

  gameState.mapObjsFromBackEnd.forEach((mapObj) => {
    gameState.gameMapObjects[mapObj.x * 10 + mapObj.y] = mapObj;
  });
}
