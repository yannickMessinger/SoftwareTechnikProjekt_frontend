export class LoginService {

    async register(username:string, password:string): Promise<any> {
        return fetch("/api/player", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
                userName: username,
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

    async login(username:string, password:string): Promise<{userId: number, userName: string} | null> {
        return fetch("/api/player/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
                userName: username,
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

}