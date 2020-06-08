export interface User {
	id: string,
	admin_id?: string,
	seller_id?: string,
	superadmin_id?: string,
	created_at: number,
	is_disabled: boolean,
	is_seamless: boolean,
	user_type?: 'system' | 'superadmin' | 'admin' | 'seller' | 'user',
	date_str?:string
}

export interface Response<T> {
	success: boolean,
	reason?: string,
	data: T
}

export interface Config{
	apiAddr:string
}
