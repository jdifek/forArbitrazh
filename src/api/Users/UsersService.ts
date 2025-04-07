import $api from '../http'
import { IAuthTokenResponse, IRefreshToken } from '../Token/TokenTypes'
import {
	IRefreshTokenResponse,
	IUserMeResponse,
	IUserSetPassword,
	IUserSetPasswordParams,
	IUsersListResponse,
	IUserTokenParams,
	IUserUpdateParams,
} from './UsersTypes'

export default class UsersService {
	static async getUsers(): Promise<IUsersListResponse> {
		return (await $api.get<IUsersListResponse>('users/')).data
	}

	static async getUserById(id: number): Promise<IUserMeResponse> {
		return (await $api.get<IUserMeResponse>(`users/${id}/`)).data
	}

	static async updateUser(
		id: number,
		params: IUserUpdateParams
	): Promise<IUserMeResponse> {
		return (await $api.patch<IUserMeResponse>(`users/${id}/`, params)).data
	}

	static async setUserPassword(
		id: number,
		data: { password1: string; password2: string }
	): Promise<void> {
		await $api.post(`users/${id}/set-password/`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	static async getUserToken(
		params: IUserTokenParams
	): Promise<IAuthTokenResponse> {
		return (await $api.post<IAuthTokenResponse>('users/token/', params)).data
	}

	static async refreshUserToken(
		params: IRefreshToken
	): Promise<IRefreshTokenResponse> {
		return (
			await $api.post<IRefreshTokenResponse>('users/token/refresh/', params)
		).data
	}

	static async getMe(): Promise<IUserMeResponse> {
		return (await $api.get<IUserMeResponse>('users/me/')).data
	}
}
