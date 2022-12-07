import { computed, reactive } from "vue";
import User from '../typings/IUser';
import { E_LobbyMode } from "../typings/E_LobbyMode";
import { ILobby } from "../typings/ILobby";

const state = reactive<User>({
  userId:  undefined,
  userName: "",
  activeLobby: {
    lobbyId: 0,
    lobbyName: "",
    numOfPlayers: 0,
    lobbyModeEnum: E_LobbyMode.BUILD_MODE
  }
});

function setId(id:number): void {
  state.userId = id;
}

function setName(name: string): void {
  state.userName = name;
}

async function sendName():Promise<void> {
  const response = await fetch('/api/player', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      userName: state.userName
    })
  });

  console.log("sendName():", response);
  const jsondata = await response.json();
  setId(Number(jsondata));
  console.log("state.id", state.userId);
}

async function setActiveLobby(lobby: ILobby):Promise<void> {
  state.activeLobby = lobby;
  const response = await fetch(`/api/lobby/get_players/${lobby.lobbyId}?player_id=${state.userId}`, {
    method: 'POST',
  });
  console.log(response);
}

export default function useUser() {
  return {
    name: computed(() => state.userName),
    userID: computed(() => state.userId ),
    activeLobby: computed(() => state.activeLobby),
    setName,
    sendName,
    setActiveLobby
  };
}

