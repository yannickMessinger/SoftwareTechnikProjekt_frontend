import {createRouter, createWebHistory} from "vue-router";
import Homepage from "../views/Homepage.vue";
import GameMode3d from "../views/GameMode3d.vue";
const history = createWebHistory()
const router = createRouter({
    history,
    routes: [
        {
            path: '/homepage',
            component: Homepage,
        },
        {
            path: '/gameMode3d',
            component: GameMode3d,
        }
    ]
})

export default router