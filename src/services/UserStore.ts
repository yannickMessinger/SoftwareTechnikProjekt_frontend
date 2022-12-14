import { computed, reactive, readonly } from "vue";
import User from '../typings/IUser';
import { E_LobbyMode } from "../typings/E_LobbyMode";
import { ILobby } from "../typings/ILobby";
import { IGetPlayerResponseDTO } from "../typings/IGetPlayerResponseDTO";

const state = reactive<User>({
  userId: 0 as IGetPlayerResponseDTO["userId"],
  userName: "" as IGetPlayerResponseDTO["userName"],
  errormessage:"",
  loggedIn: false,
  activeLobby: {
    lobbyId: 0,
    lobbyName: "",
    numOfPlayers: 0,
    lobbyModeEnum: E_LobbyMode.BUILD_MODE
  }
});

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
  state.userId = Number(jsondata)
  console.log("state.userId", state.userId);
}

async function setActiveLobby(lobby: ILobby):Promise<void> {
  state.activeLobby = lobby;
  await postActiveLobby(lobby);
}

async function postActiveLobby(lobby:ILobby) {
  const response = await fetch(`/api/lobby/get_players/${lobby.lobbyId}?player_id=${state.userId}`, {
    method: 'POST',
  });
  console.log("setActiveLobby() -> post player to lobby - response", response);
}

async function register(username:string, password:string): Promise<any> {
  return fetch("/api/player", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({
          userName: username as IGetPlayerResponseDTO["userName"],
          password: password
      })
  })
  .then(response=> {
      if (response.status === 200) {
          return response.json()
      } else {
          return null
      }
  })
  .then(data=>{ return data })
  .catch(err => console.log(err))
}

async function login(username:string, password:string): Promise<{userId: number, userName: string} | null> {
  return fetch("/api/player/login", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({
          userName: username as IGetPlayerResponseDTO["userName"],
          password: password
      })
  })
  .then(response=> {
      if (response.status === 200) {
          return response.json()
      } else {
          return null
      }
  })
  .then(data =>{ 
      console.log(data)
      if(data != null){
          const loginDataResponse: IGetPlayerResponseDTO = data
          state.userName = loginDataResponse.userName
          state.userId = loginDataResponse.userId
          state.errormessage = ""
          state.loggedIn = true
          console.log(state)
      }
      return data 
  })
  .catch((err) => {
    state.loggedIn = false
    state.errormessage = err
      console.log(state.errormessage)
      })
}

export default function useUser() {
  return {
    logindata : readonly(state),
    sendName,
    setActiveLobby,
    login,
    register
  };
}

