export class LoginService {

    async register(username:string, password:string): Promise<void> {
        console.log("sending register details...");
        console.log(username,password);
        // const response = await fetch("/api/user", {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({
        //         username: username,
        //         password: password
        //     })
        // })
        // console.log(response)
    }

    async login(username:string, password:string): Promise<void> {
        console.log("sending login details...");
        console.log(username,password);
        // const response = await fetch("/api/user", {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({
        //         username: username,
        //         password: password
        //     })
        // })
        // console.log(response)
    }

}