import { reactive, readonly } from "vue"
import { ILoginStateDTO } from "../../typings/ILoginStateDTO"

const loginState = reactive({
    userName: "" as ILoginStateDTO["userName"],
    userId: 0 as ILoginStateDTO["userId"],
    errormessage: "",
    loggedIn: false,
})

async function register(username: string, password: string): Promise<any> {
    return fetch("/api/player", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            userName: username,
            password: password,
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw new Error(response.statusText)
            }
        })
        .then((data) => {
            return data
        })
        .catch((err) => console.log(err))
}

async function login(
    username: string,
    password: string
): Promise<{ userId: number; userName: string } | null> {
    return fetch("/api/player/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            userName: username,
            password: password,
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw new Error(response.statusText)
            }
        })
        .then((data) => {
            const loginDataResponse: ILoginStateDTO = data
            loginState.userName = loginDataResponse.userName
            loginState.userId = loginDataResponse.userId
            loginState.errormessage = ""
            loginState.loggedIn = true
            return data
        })
        .catch((err) => console.log(err))
}

export function useLogin() {
    return {
        logindata: readonly(loginState),
        login,
        register,
    }
}