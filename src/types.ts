export interface User {
	id: string;
	admin_id?: string;
	seller_id?: string;
	superadmin_id?: string;
	created_at: number;
	is_disabled: boolean;
	is_seamless: boolean;
	user_type?: "system" | "superadmin" | "admin" | "seller" | "user";
	date_str?: string;
	password?: string;
	note?: string
}

export interface Response<T> {
	success: boolean;
	reason?: Err;
	sock_token?: string;
	token?: string;
	data: T;
}

export interface Config {
	apiAddr: string;
	token:string;
}

export interface Game {
	id: number;
	c1: number[];
	c2: number[];
	t: number[];
	balls: number[];
}

export interface Wallet {
	id: number;
	user: string;
	currency: string;
	balance: number;
	bonus_balance: number;
	game_type: string;
}
export interface Table {
	id: number;
	group_id: number;
	name: string;
	price: number;
	c1: number;
	c2: number;
	t: number;
	tulum: number;
	first_5: number;
	first_10: number;
	min_cards: number;
}
export interface TableGroup {
	id: number;
	game_id: number;
	name: String;
	group_type:
	| "SameCardSameRoomMultiBuy"
	| "SameCardMultiRoomBuy"
	| "UserBuysFromSingleTable"
	| "CardCanBeBoughtFromSingleTable";
	is_bonus: boolean;
	seller_id: String;
	tables: Table[];
}
export interface Coupon {
	card_id: number;
	table_id: number;
	uid: string;
	session_id: number;
}
export interface CurrentGameData {
	game: Game;
	wallet: Wallet;
	table_groups: TableGroup[];
	coupons: Coupon[];
	video_addr: string;
	is_auto: boolean;
	game_details: GameDetails
}
interface GameDetails {
	id: number,
	name: String,
	game_type: string,
	auto: boolean,
	created_at: number,
	video?: string,
	creator: String,
}
export interface Card {
	id: number;
	r1: number[];
	r2: number[];
	r3: number[];
}
export interface ResetData {
	id: number;
	user_id: string;
	op_time: number;
	sent: number;
	received: number;
}
export interface CashAcc {
	id: number;
	from: string;
	to: string;
	from_new_credit: number;
	to_new_credit: number;
	amount: number;
	game_id: number;
	game_name: string;
	is_bonus: boolean;
	time: number;
}
export interface CashAccResponse {
	all: CashAcc[];
	since_reset: CashAcc[];
	last_reset_time: number;
}
export interface CouponHistory {
	id: number;
	userid: string;
	couponid: number;
	price: number;
	tg_name: string;
	table_name: string;
	table_id: number;
	game_name: string;
	sessionid: number;
	op_time: number;
	buy_time_credit: number;
	new_credit?: number;
	c1?: number;
	c1_5?: number;
	c2?: number;
	c2_10?: number;
	t?: number;
	tulum?: number;
}

export type Err =
	| "NotFound"
	| "CardIndexNotFound"
	| "InvalidParent"
	| "AlreadyExists"
	| "NothingToUpdate"
	| "InvalidCreds"
	| "ExecutionCancelled"
	| "InsufficientCredit"
	| "InsufficientPermissions"
	| "InvalidGameType"
	| "InvalidTombalaBall"
	| "PoisonError"
	| "UserDisabled"
	| "NoTombalaBallInQueue"
	| "InvalidCardData"
	| { DBInitError: string }
	| { DBErr: string }
	| { ConfigErr: string }
	| { ConnErr: string }
	| { Unknown: string }
	| { RedisError: string }
	| { JsonError: string }
	| { GameError: string }
	| { MissingField: string }
	| { InvalidField: string };
