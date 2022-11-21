import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import MenuView from "../views/MenuView.vue";
import EditorView from "../views/EditorView.vue";

const history = createWebHistory()
const router = createRouter({
    history,
    routes: [
        {
            path: '/',
            component: MenuView
        },
        {
            path: '/editor',
            component: EditorView
        },
    ]
})

export default router