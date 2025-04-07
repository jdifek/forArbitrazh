// Token Request
export interface IAuthToken {
	username: string
	password: string
}

// Token Response
export interface IAuthTokenResponse {
	data: {
		access: string
		refresh: string
	}
	errors: []
	status: string
}

// Refresh Token Request
export interface IRefreshToken {
	refresh: string
}

// Refresh Token Response
export interface IRefreshTokenResponse {
	data: { access: string }
	errors: []
	status: string
}
