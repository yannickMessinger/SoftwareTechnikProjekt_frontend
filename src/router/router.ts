import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import LobbyView from "../views/LobbyView.vue"
import EditorView from "../views/EditorView.vue";
import Game from "../views/Game.vue";

const history = createWebHistory()
const router = createRouter({
    history,
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/lobby',
            component: LobbyView
        },
        {
            path: '/editor',
            component: EditorView
        },
        {
            path: '/game',
            component: Game,
        },
    ]
})

export default router