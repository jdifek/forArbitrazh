import $api from '../http'
import {
	IAuthToken,
	IAuthTokenResponse,
	IRefreshToken,
	IRefreshTokenResponse,
} from './TokenTypes'

export default class TokenService {
	static async getToken(params: IAuthToken): Promise<IAuthTokenResponse> {
		return (await $api.post<IAuthTokenResponse>('token/', params)).data
	}

	static async refreshToken(
		params: IRefreshToken
	): Promise<IRefreshTokenResponse> {
		return (await $api.post<IRefreshTokenResponse>('token/refresh/', params))
			.data
	}
}
