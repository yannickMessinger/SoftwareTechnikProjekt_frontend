import { createRouter, createWebHistory } from "vue-router"
import EditorView from "../views/EditorView.vue"
import Game from "../views/Game.vue"
import HomepageView from "../views/HomepageView.vue"
import LoginView from "../views/LoginView.vue"
import CreateLobbyView from "../views/CreateLobbyView.vue"
import LobbySelect from "../views/LobbySelect.vue"
import LobbyView from "../views/LobbyView.vue"
import useUser from "../services/User/UserStore"

/**
 * Custom hook to access user data.
 * @returns {IUser} Returns an object containing the login data of the user.
 */
const { logindata } = useUser()

/**
 * Uses the createWebHistory function from the vue-router library.
 */
const history = createWebHistory()

/**
 * Creates and configures the application's router.
 */
const router = createRouter({
    history,
    routes: [
        {
            path: "/",
            component: HomepageView,
        },
        {
            path: "/login",
            component: LoginView,
        },
        {
            path: "/lobby",
            component: LobbySelect,
        },
        {
            path: "/lobbyview",
            component: LobbyView,
        },
        {
            path: "/editor",
            component: EditorView,
        },
        {
            path: "/game",
            component: Game,
            name: "Game",
        },
        {
            path: "/edit",
            component: EditorView,
            name: "Edit",
        },
        {
            path: "/create",
            component: CreateLobbyView,
            name: "CreateLobby",
        },
    ],
})

/**
 * Before navigation, this function checks if the user is logged in.
 * If the user is not logged in and the target path is not "/login",
 * the navigation is redirected to the "/login" path.
 * Otherwise, the navigation continues to the target path.
 * @function
 * @param {Object} to - The target route object of navigation.
 * @param {Object} from - The current route object of navigation.
 * @param {Function} next - The callback function to move to the target route.
 */
router.beforeEach((to, from, next) => {
    if (!logindata.loggedIn && to.path !== "/login") {
        next("/login")
    } else {
        next()
    }
})

/**
 * @function
 * @description This function is used to navigate to different routes based on user's login status and the path they are trying to navigate to.
 * If the user is not logged in and the path is not "/login", it will redirect the user to "/login".
 * If the user is logged in and the path is "/", it will check if the user is in an active lobby or not.
 * If the user is not in an active lobby, it will redirect the user to "/lobby".
 * If the user is in an active lobby, it will redirect the user to "/lobbyview".
 * In other cases, it will proceed to the next navigation.
 * @param {Object} to - The target location to be navigated.
 * @param {Object} from - The current location.
 * @param {Function} next - Callback function to proceed with the next navigation.
 */
router.beforeEach((to, from, next) => {
    if (logindata.loggedIn && to.path === "/") {
        console.warn(" '/' path detected")
        if (logindata.activeLobby.lobbyId == -1) {
            next("/lobby")
        } else {
            next("/lobbyview")
        }
    } else {
        next()
    }
})

export default router
