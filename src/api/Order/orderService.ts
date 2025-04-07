import $api from '../http'
import { IGetOrdersParams, IGetOrdersResponse } from './orderTypes'

export default class OrdersService {
	static async getOrders(
		params?: IGetOrdersParams
	): Promise<IGetOrdersResponse> {
		return (
			await $api.get<IGetOrdersResponse>('orders/', {
				params,
			})
		).data
	}
}
