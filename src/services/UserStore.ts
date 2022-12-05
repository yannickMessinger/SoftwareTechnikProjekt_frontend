import { computed, reactive } from "vue";
import User from '../models/User';
import { E_LobbyMode } from "../typings/E_LobbyMode";
import { ILobby } from "../typings/ILobby";

const state = reactive<User>({
  id:  undefined,
  username: "",
  activeLobby: {
    lobbyId: 0,
    lobbyName: "",
    numOfPlayers: 0,
    lobbyModeEnum: E_LobbyMode.BUILD_MODE
  }
});

function setId(id:number): void {
  state.id = id;
}

function setName(name: string): void {
  state.username = name;
}

async function sendName():Promise<void> {
  const response = await fetch('/api/player', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      userName: state.username
    })
  });

  console.log("sendName():", response);
  const jsondata = await response.json();
  setId(Number(jsondata));
  console.log("state.id", state.id);
}

async function setActiveLobby(lobby: ILobby):Promise<void> {
  state.activeLobby = lobby;
  const response = await fetch(`/api/lobby/get_players/${lobby.lobbyId}?player_id=${state.id}`, {
    method: 'POST',
  });
}

export default function useUser() {
  return {
    name: computed(() => state.username),
    userID: computed(() => state.id ),
    activeLobby: computed(() => state.activeLobby),
    setName,
    sendName,
    setActiveLobby
  };
}

