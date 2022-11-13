import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Game from "../views/Game.vue";

const history = createWebHistory()
const router = createRouter({
    history,
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/game',
            component: Game,
        },
    ]
})

export default router