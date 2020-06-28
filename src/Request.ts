import { Config, Response, User, CurrentGameData, Wallet, Table } from "./types";

interface StrMap {
	[key: string]: any
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
	updateProfile({ id }: User, data: StrMap): Promise<Response<void>> {
		return this.patch(`/users/${id}`, data)
	}
	getWallets({ id }: User, game_ids: Number[]): Promise<Response<Wallet[]>> {
		return this.get(`/users/wallets/${id}?ids=${game_ids.join(",")}`)
	}
	updateCredit({ id }: User, amount: number, game_id: number, is_bonus: boolean,): Promise<Response<number>> {
		return this.patch(`/users/credit/${id}`, { amount, game_id, is_bonus });
	}
	addTableGroup(game_id: number, name: string, group_type: string, is_bonus: boolean): Promise<Response<number>> {
		return this.post('/games/tombala/tg', { game_id, name, group_type, is_bonus });
	}
	deleteTableGroup(tgID: number): Promise<Response<void>> {
		return this.delete(`/games/tombala/tg/${tgID}`, {});
	}
	addTable(group_id: number, name: string, price: number, c1: number, c2: number, t: number, tulum: number): Promise<Response<number>> {
		return this.post('/games/tombala/tbl', { group_id, name, price, c1, c2, t, tulum })
	}
	deleteTable(id: number): Promise<Response<void>> {
		return this.delete(`/games/tombala/tbl/${id}`, {});
	}
	updateTable(id: number, table: Table): Promise<Response<void>> {
		return this.patch(`/games/tombala/tbl/${id}`, table);
	}
	lockCard(tgID: number, cardID: number): Promise<Response<void>> {
		return this.post(`/games/tombala/cards/lock/${tgID}/${cardID}`, {});
	}
	unLockCard(tgID: number, cardID: number): Promise<Response<void>> {
		return this.post(`/games/tombala/cards/unlock/${tgID}/${cardID}`, {});
	}
	getCardData(tgID: number): Promise<Response<number[]>> {
		return this.get(`/games/tombala/cards/locked/${tgID}`);
	}
}
