export interface User {
	id: string,
	admin_id?: string,
	seller_id?: string,
	superadmin_id?: string,
	created_at: number,
	is_disabled: boolean,
	is_seamless: boolean,
	user_type?: 'system' | 'superadmin' | 'admin' | 'seller' | 'user',
	date_str?: string,
	password?: string
}

export interface Response<T> {
	success: boolean,
	reason?: Err,
	sock_token?: string,
	token?:string,
	data: T
}

export interface Config {
	apiAddr: string
}

export interface Game {
	id: number,
	c1: number[],
	c2: number[],
	t: number[],
	balls: number[],
}

export interface Wallet {
	id: number,
	user: string,
	currency: string,
	balance: number,
	bonus_balance: number,
	game_id: number,
}
export interface Table {
	id: number,
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
}
export interface TableGroup {
	id: number,
	game_id: number,
	name: String,
	group_type: "SameCardSameRoomMultiBuy" | "SameCardMultiRoomBuy" | "UserBuysFromSingleTable",
	is_bonus: boolean,
	seller_id: String,
	tables: Table[],
}
export interface Coupon {
	card_id: number,
	table_id: number,
	uid: string,
	session_id: number,
}
export interface CurrentGameData {
	game: Game,
	wallet: Wallet,
	table_groups: TableGroup[],
	coupons: Coupon[],
}
export interface Wallet {
	id: number,
	user: string,
	currency: string,
	balance: number,
	bonus_balance: number,
	game_id: number,
	game_name: string,
}
export interface Card {
	id: number,
	r1: number[],
	r2: number[],
	r3: number[]
}
export type Err = 'NotFound'
	| 'CardIndexNotFound'
	| 'InvalidParent'
	| 'AlreadyExists'
	| 'NothingToUpdate'
	| 'InvalidCreds'
	| 'ExecutionCancelled'
	| 'InsufficientCredit'
	| 'InsufficientPermissions'
	| 'InvalidGameType'
	| 'InvalidTombalaBall'
	| 'PoisonError'
	| 'UserDisabled'
	| 'NoTombalaBallInQueue'
	| 'InvalidCardData'
	| { DBInitError: string }
	| { DBErr: string }
	| { ConfigErr: string }
	| { ConnErr: string }
	| { Unknown: string }
	| { RedisError: string }
	| { JsonError: string }
	| { GameError: string }
	| { MissingField: string }
	| { InvalidField: string }
