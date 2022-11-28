import { computed, reactive } from "vue";
import User from '../models/User';

const state = reactive<User>({
  username: ""
});

function setName(name: string): void {
  state.username = name;
}

export default function useUser() {
  return {
    name: computed(() => state.username),
    setName,
  };
}
