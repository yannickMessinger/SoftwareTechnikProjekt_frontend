import { computed, reactive } from "vue";
import User from '../models/User';

const state = reactive<User>({
  id:  undefined,
  username: ""
});

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
  })

  console.log(response)
  const jsondata = await response.json();
  console.log("User-ID", jsondata)
  state.id = jsondata
}

export default function useUser() {
  return {
    name: computed(() => state.username),
    setName,
    sendName
  };
}
