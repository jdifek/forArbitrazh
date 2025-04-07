// Refresh Token Response
export interface IRefreshTokenResponse {
	access: string
}

export interface IUser {
	id: number
	last_login: string
	created_at: string
	updated_at: string
	username: string
	role: UserRole
	access?: string
	email: string
	full_name: string
	phone_number: string
	has_access_to?: HasAccessTo[]
	notified_by?: NotifiedBy[]
}

export type HasAccessTo = {
	id: number
	name: string
}

export type NotifiedBy = {
	id: number
	name: string
}

export type UserRole =
	| 'super_admin'
	| 'admin'
	| 'operator'
	| 'driver'
	| 'technician'
	| 'collector'
	| 'accountant'

// UserMe Response
export interface IUserMeResponse {
	data: IUser
	errors: []
	status: string
}

// Set password

export interface IUserSetPassword {
	data: {
		password1: string
		password2: string
	}
	errors: []
	status: string
}

export interface IUserSetPasswordParams {
	password1?: string
	password2?: string
}

// updateUsers

export interface IUserUpdateParams {
	email?: string
	role?: string
	last_login?: string
	username?: string
	full_name?: string
	phone_number?: string
}

// Users List Response
export interface IUsersListResponse {
	data: { count: number; next?: string; previous?: string; results: IUser[] }
	errors: []
	status: string
}

// User Token Request
export interface IUserTokenParams {
	username: string
	password: string
}
