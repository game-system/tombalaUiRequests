import { Config, Response, User } from "./types";

interface StrMap {
	[key: string]: string
}
function genBody(a: StrMap): string {
	return Object.keys(a).reduce((state: string[], curr) => {
		state.push(`${curr}=${a[curr]}`)
		return state
	}, []).join("&")
}

export default class Request {
	private apiAddr: string = "";
	constructor(c: Config) {
		const { apiAddr } = c;
		this.apiAddr = apiAddr;
	}
	private get<T>(path: string): Promise<Response<T>> {
		return fetch(`${this.apiAddr}${path}`, { credentials: "include" })
			.then(d => d.json())
	}
	private post<T>(path: string, body: StrMap): Promise<Response<T>> {
		return fetch(`${this.apiAddr}${path}`
			, {
				method: "POST",
				credentials: "include",
				body: genBody(body),
				headers: {
					"content-type": "application/x-www-form-urlencoded"
				}
			})
			.then(d => d.json())
	}
	login(id: string, password: string): Promise<Response<void>> {
		return this.post("/users/login", { id, password })
	}
	me(): Promise<Response<User>> {
		return this.get("/users/me")
	}
	children(): Promise<Response<User[]>> {
		return this.get("/users/children")
	}


}
