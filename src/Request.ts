import {
	Card,
	Config,
	CurrentGameData,
	Response,
	Table,
	User,
	Wallet,
	CashAccResponse,
	CashAcc,
	ResetData,
	CouponHistory
} from "./types";

interface StrMap {
	[key: string]: any;
}
function genBody(a: StrMap): string {
	return Object.keys(a)
		.reduce((state: string[], curr) => {
			state.push(`${curr}=${a[curr]}`);
			return state;
		}, [])
		.join("&");
}

export default class Request {
	private apiAddr: string = "";
	constructor(c: Config) {
		const { apiAddr } = c;
		this.apiAddr = apiAddr;
	}
	private async get<T>(path: string): Promise<Response<T>> {
		const d = await fetch(`${this.apiAddr}${path}`, {
			credentials: "include",
			headers: {
				"x-token": localStorage.getItem("token")
			}
		});
		return await d.json();
	}
	private async delete<T>(path: string, body: StrMap): Promise<Response<T>> {
		const d = await fetch(`${this.apiAddr}${path}`, {
			method: "DELETE",
			credentials: "include",
			body: genBody(body),
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"x-token": localStorage.getItem("token")
			}
		});
		return await d.json();
	}
	private async post<T>(path: string, body: StrMap): Promise<Response<T>> {
		const d = await fetch(`${this.apiAddr}${path}`, {
			method: "POST",
			credentials: "include",
			body: genBody(body),
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"x-token": localStorage.getItem("token")
			}
		});
		return await d.json();
	}
	private async patch<T>(path: string, body: StrMap): Promise<Response<T>> {
		const d = await fetch(`${this.apiAddr}${path}`, {
			method: "PATCH",
			credentials: "include",
			body: genBody(body),
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"x-token": localStorage.getItem("token")
			}
		});
		return await d.json();
	}
	async login(id: string, password: string): Promise<Response<void>> {
		const d: Response<void> = await this.post("/users/login", {
			id,
			password
		});
		if (d.token) localStorage.setItem("token", d.token);
		return d;
	}
	async oplogin(
		id: string,
		password: string
	): Promise<Response<{ game_id: number }>> {
		const d: Response<{ game_id: number }> = await this.post("/op/login", {
			id,
			password
		});
		if (d.token) localStorage.setItem("token", d.token);
		return d;
	}
	async me(): Promise<Response<User>> {
		return this.get("/users/me");
	}
	async children(): Promise<Response<User[]>> {
		return this.get("/users/children");
	}
	async logout(): Promise<Response<void>> {
		return this.get("/users/logout");
	}
	async addChild({ id, password,note }: User): Promise<Response<User>> {
		return this.post("/users/new", { id, password,note });
	}
	async deleteChild(
		{ id }: User,
		withChildren: boolean
	): Promise<Response<void>> {
		return this.delete(`/users/${id}`, {
			with_children: withChildren + ""
		});
	}
	async disableChild(
		{ id }: User,
		withChildren: boolean
	): Promise<Response<void>> {
		return this.patch(`/users/${id}/disable`, {
			with_children: withChildren + ""
		});
	}
	async enableChild(
		{ id }: User,
		withChildren: boolean
	): Promise<Response<void>> {
		return this.patch(`/users/${id}/enable`, {
			with_children: withChildren + ""
		});
	}
	async getGameData(gameID: number): Promise<Response<CurrentGameData>> {
		return this.get(`/games/tombala/${gameID}`);
	}
	async updateProfile({ id }: User, data: StrMap): Promise<Response<void>> {
		return this.patch(`/users/${id}`, data);
	}
	async getWallets(
		{ id }: User,
		game_types: string[]
	): Promise<Response<Wallet[]>> {
		return this.get(`/users/wallets/${id}?ids=${game_types.join(",")}`);
	}
	async updateCredit(
		{ id }: User,
		amount: number,
		game_type: string,
		is_bonus: boolean
	): Promise<Response<number>> {
		return this.patch(`/users/credit/${id}`, { amount, game_type: game_type, is_bonus });
	}
	async addTableGroup(
		game_id: number,
		name: string,
		group_type: string,
		is_bonus: boolean
	): Promise<Response<number>> {
		return this.post("/games/tombala/tg", {
			game_id,
			name,
			group_type,
			is_bonus
		});
	}
	async deleteTableGroup(tgID: number): Promise<Response<void>> {
		return this.delete(`/games/tombala/tg/${tgID}`, {});
	}
	async addTable(
		group_id: number,
		name: string,
		price: number,
		c1: number,
		c2: number,
		t: number,
		tulum: number,
		first_5: number,
		first_10: number,
		min_cards: number
	): Promise<Response<number>> {
		return this.post("/games/tombala/tbl", {
			group_id,
			name,
			price,
			c1,
			c2,
			t,
			tulum,
			first_5,
			first_10,
			min_cards
		});
	}
	async deleteTable(id: number): Promise<Response<void>> {
		return this.delete(`/games/tombala/tbl/${id}`, {});
	}
	async updateTable(id: number, table: Table): Promise<Response<void>> {
		return this.patch(`/games/tombala/tbl/${id}`, table);
	}
	async lockCard(tgID: number, cardID: number): Promise<Response<void>> {
		return this.post(`/games/tombala/cards/lock/${tgID}/${cardID}`, {});
	}
	async unLockCard(tgID: number, cardID: number): Promise<Response<void>> {
		return this.post(`/games/tombala/cards/unlock/${tgID}/${cardID}`, {});
	}
	async getLockedCards(tgID: number): Promise<Response<number[]>> {
		return this.get(`/games/tombala/cards/locked/${tgID}`);
	}
	async getCashAccounting(
		year: number,
		month: number
	): Promise<Response<CashAccResponse>> {
		return this.get(`/users/acc/cash/${year}/${month}`);
	}
	async resetAccounting(password: string): Promise<Response<CashAcc>> {
		return this.post(`/users/acc/cash/reset`, { password });
	}
	async resetAccountingList(): Promise<Response<ResetData[]>> {
		return this.get(`/users/acc/reset/list`);
	}
	async tombalaCouponHistory(
		uid: string,
		year: number,
		month: number
	): Promise<Response<CouponHistory[]>> {
		return this.get(`/games/tombala/history/${uid}/${year}/${month}`);
	}
	async getGameCards(gameId: number): Promise<Response<Card[]>> {
		const { data, success, reason, sock_token } = await this.get(
			`/games/tombala/cards/${gameId}`
		);
		return {
			data: (data as any[]).map((c: number[] | number[][]) => {
				return {
					id: c[0] as number,
					r1: c[1] as number[],
					r2: c[2] as number[],
					r3: c[3] as number[]
				};
			}),
			reason: reason,
			success: success,
			sock_token: sock_token
		} as Response<Card[]>;
	}
}
