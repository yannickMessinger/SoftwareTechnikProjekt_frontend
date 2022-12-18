/**
 *Data class to fetch and update the List of existing Lobbys
 */

import { reactive, readonly } from "vue";
import { IAddLobbyRequestDTO } from "../typings/IAddLobbyRequestDTO";
import { ILobby } from "../typings/ILobby";
import { E_LobbyMode } from "../typings/E_LobbyMode";
import { ILobbyListState } from "../typings/ILobbyListState";
import useUser from "./UserStore";
import { ILobbyDTO } from "../typings/ILobbyDTO";
import { Client } from "@stomp/stompjs";
import { useEditor } from "./Editor/useEditor";
import { fetchPlayerList } from "./usePlayerList";
import IUser from "../typings/IUser";

const ws_url = `ws://${window.location.host}/stomp`;
const DEST = "/topic/public";
const SEND_MSG = "/app/lobby.sendMessage";
const JOIN_MSG = "/app/lobby.join";
const SWITCHMODE_MSG = "/app/lobby.switchMode";

let stompClient: Client;
const { user, userId, activeLobby, setActiveLobby } = useUser();

interface IStompMessage {
  playerContent: IUser;
  lobbyContent: ILobby;
  type: string;
}

const lobbyState = reactive<ILobbyListState>({
  lobbylist: Array<ILobbyDTO>(),
  errormsg: "",
});

export function useLobbyList() {
  return {
    lobbyList: lobbyState,
    updateLobbyList,
    receiveLobbyUpdates,
    joinMessage,
    changeLobbyModeMessage
  };
}

//functions to fetch and update List of available lobbys from backend
export async function updateLobbyList(): Promise<void> {
  const url = "/api/lobby";

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      lobbyState.errormsg = response.statusText;
      lobbyState.lobbylist = [];
      console.log("error in fetching lobbylist");
      throw new Error(response.statusText);
    }

    const jsondata: ILobbyDTO[] = await response.json();
    //console.log("JSONDATA");
    //console.log(jsondata);

    lobbyState.lobbylist = jsondata;
    lobbyState.errormsg = "";
  } catch (error) {
    console.log(" error in updateLobbyList");
  }
}

// export async function updateLobby(id: number) {
//   const url = "/api/lobby";

//   try {
//     const response = await fetch(`${url}/${id}`, { method: "GET" });
//     if (!response.ok) {
//       console.log("can't get active lobby");
//     }
//     const jsondata: ILobbyDTO = await response.json();
//     activeLobbyState.hostID = jsondata.hostID;
//     activeLobbyState.lobbyID = jsondata.lobbyID;
//     activeLobbyState.lobbyModeEnum = jsondata.lobbyModeEnum;
//     activeLobbyState.lobbyName = jsondata.lobbyName;
//     activeLobbyState.mapID = jsondata.mapID;
//     activeLobbyState.numOfPlayers = jsondata.numOfPlayers;
//     activeLobbyState.playerList = jsondata.playerList;
//     setActiveLobby(activeLobbyState);
//   } catch (error) {
//     console.log(error);
//   }
// }

//adds new lobby and sends it to backend, then update of lobbylist
export async function createNewLobby(
  addLobbyName: string,
  addNumOfPlayers: number,
  addLobbyMode: E_LobbyMode
) {
  //console.log(`User ID from useLobbyList  ${userId.value}`);
  const url = "/api/lobby";

  const addLobby: IAddLobbyRequestDTO = {
    lobbyName: addLobbyName,
    numOfPlayers: addNumOfPlayers,
    lobbyModeEnum: addLobbyMode,
    hostId: userId.value,
  };

  //console.log(addLobby);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addLobby),
    });
    let id = await res.json();
    console.log(id);
    //setActiveLobby(id);

    await updateLobbyList();
  } catch (error) {
    console.log(error);
  }
}

function joinMessage() {
  console.log(`Lobby ID aus joinMessage: ${ activeLobby.value.lobbyId}, mapId: ${activeLobby.value.mapId}`)
  if (
    stompClient &&
    userId.value !== undefined &&
    activeLobby.value.lobbyId !== -1
  ) {
    const lobbyMessage: IStompMessage = {
      playerContent: {
        userId: user.userId,
        userName: user.userName,
        activeLobby: {
          lobbyId: user.activeLobby.lobbyId,
          mapId: user.activeLobby.mapId,
          lobbyName: user.activeLobby.lobbyName,
          numOfPlayers: user.activeLobby.numOfPlayers,
          lobbyModeEnum: user.activeLobby.lobbyModeEnum,
        },
      },
      lobbyContent: {
        lobbyId: user.activeLobby.lobbyId,
        hostId: user.activeLobby.hostId,
        mapId: user.activeLobby.mapId,
        lobbyName: user.activeLobby.lobbyName,
        numOfPlayers: user.activeLobby.numOfPlayers,
        lobbyModeEnum: user.activeLobby.lobbyModeEnum,
      },
      type: "JOIN",
    };
    console.log(lobbyMessage.lobbyContent);
    stompClient.publish({
      destination: JOIN_MSG,
      headers: {},
      body: JSON.stringify(lobbyMessage),
    });
  }
}

function changeLobbyModeMessage() {
  if (
    stompClient &&
    userId.value !== undefined &&
    activeLobby.value.lobbyId !== -1
  ) {
  }
  const switchModeMessage: IStompMessage = {
    playerContent: {
      userId: user.userId,
      userName: user.userName,
      activeLobby: {
        lobbyId: user.activeLobby.lobbyId,
        mapId: user.activeLobby.mapId,
        lobbyName: user.activeLobby.lobbyName,
        numOfPlayers: user.activeLobby.numOfPlayers,
        lobbyModeEnum: user.activeLobby.lobbyModeEnum,
      },
    },
    lobbyContent: {
      lobbyId: user.activeLobby.lobbyId,
      hostId: user.activeLobby.hostId,
      mapId: user.activeLobby.mapId,
      lobbyName: user.activeLobby.lobbyName,
      numOfPlayers: user.activeLobby.numOfPlayers,
      lobbyModeEnum: user.activeLobby.lobbyModeEnum,
    },
    type: "SWITCH_MODE",
  };

  stompClient.publish({
    destination: SWITCHMODE_MSG,
    headers: {},
    body: JSON.stringify(switchModeMessage),
  });
}

function receiveLobbyUpdates() {
  stompClient = new Client({
    brokerURL: ws_url,
  });
  stompClient.onWebSocketError = (error) => {
    console.log("error", error.message);
  };
  stompClient.onStompError = (frame) => {
    console.log("error", frame.body);
  };

  stompClient.onConnect = (frame) => {
    console.log("lobby ws connected");
    stompClient.subscribe(DEST, (message) => {
      const lobbyUpdate: IStompMessage = JSON.parse(message.body);
      onMessageReceived(lobbyUpdate);
    });
  };

  stompClient.onDisconnect = () => {
    console.log("lobby ws disconnected");
  };

  stompClient.activate();
}

async function onMessageReceived(payload: IStompMessage) {
  if (payload.lobbyContent.lobbyId === activeLobby.value.lobbyId) {
    if (payload.type === "JOIN") {
      await fetchPlayerList();
      activeLobby.value.playerList?.push({
        userId: payload.playerContent.userId,
        userName: payload.playerContent.userName,
        activeLobby: payload.lobbyContent,
      });
    }
    if(payload.type === "SWITCH_MODE"){
      activeLobby.value.lobbyModeEnum = payload.lobbyContent.lobbyModeEnum
    }
  }
}
