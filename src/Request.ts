import { Config, Response, User, CurrentGameData } from "./types";

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
	private delete<T>(path: string, body: StrMap): Promise<Response<T>> {
		return fetch(`${this.apiAddr}${path}`
			, {
				method: "DELETE",
				credentials: "include",
				body: genBody(body),
				headers: {
					"content-type": "application/x-www-form-urlencoded"
				}
			})
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
	private patch<T>(path: string, body: StrMap): Promise<Response<T>> {
		return fetch(`${this.apiAddr}${path}`
			, {
				method: "PATCH",
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
	logout(): Promise<Response<void>> {
		return this.get("/users/logout")
	}
	addChild({ id, password }: User): Promise<Response<User>> {
		return this.post("/users/new", { id, password })
	}
	deleteChild({ id }: User, withChildren: boolean): Promise<Response<void>> {
		return this.delete(`/users/${id}`, { with_children: withChildren + '' })
	}
	disableChild({ id }: User, withChildren: boolean): Promise<Response<void>> {
		return this.patch(`/users/${id}/disable`, { with_children: withChildren + '' })
	}
	enableChild({ id }: User, withChildren: boolean): Promise<Response<void>> {
		return this.patch(`/users/${id}/enable`, { with_children: withChildren + '' })
	}
	getGameData(gameID: number): Promise<Response<CurrentGameData>> {
		return this.get(`/games/tombala/${gameID}`)
	}
	updateProfile({ id }: User, data: any): Promise<Response<void>> {
		return this.post(`/${id}`, data)
	}
}
