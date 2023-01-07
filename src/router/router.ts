import {createRouter, createWebHistory} from "vue-router"
import Home from "../views/Home.vue"
import EditorView from "../views/EditorView.vue"
import Game from "../views/Game.vue"
import HomepageView from "../views/HomepageView.vue"
import LoginView from "../views/LoginView.vue"
import CreateLobbyView from "../views/CreateLobbyView.vue"
import LobbySelect from "../views/LobbySelect.vue"
import LobbyView from "../views/LobbyView.vue"



const history = createWebHistory()
const router = createRouter({
    history,
    routes: [
        {
            path: '/',
            component: HomepageView
        },
        {
            path: '/login',
            component: LoginView
        },
        {
            path: '/lobby',
            component: LobbySelect
        },
        {
            path: '/lobbyview',
            component: LobbyView
        },
        {
            path: '/editor',
            component: EditorView
        },
        {
            path: '/game/:gameId',
            component: Game,
            name: 'Game'
        },
        {
            path: '/edit/:gameId',
            component: EditorView,
            name: 'Edit'
        },
        {
            path:'/create',
            component: CreateLobbyView,
            name: 'CreateLobby'

        }
    ]
})

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('user')
    if (!loggedIn && to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  })

export default router