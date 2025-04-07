import $api from '../http'
import {
	IGetProductsNamesResponse,
	IPosDeviceDetails,
	IPosDevicesListResponse,
	IPosDeviceUpdateParams,
	ICashCollectionsResponse,
	ICashCollectionsParams,
	MaintenanceResponse,
	IPosDriverDevicesListResponse,
	IPosTechnicianDevicesListResponse,
	IPosTechnicianDeviceDetails,
	IPosDriverDeviceDetails,
	IPosDriverDeviceUpdateParams,
	IPosTechnicianDeviceUpdateParams,
} from './PosDevicesTypes'

export default class PosDevicesService {
	static async getDevices(params?: {
		is_active: boolean
	}): Promise<IGetProductsNamesResponse> {
		return (
			await $api.get<IGetProductsNamesResponse>('pos/devices/', {
				params: { limit: 100, ...params },
			})
		).data
	}

	static async getDriverDevices(params?: {
		is_active: boolean
	}): Promise<IPosDriverDevicesListResponse> {
		return (
			await $api.get<IPosDriverDevicesListResponse>('pos/driver/devices/', {
				params: { limit: 100, ...params },
			})
		).data
	}

	static async getTechnicianDevices(params?: {
		is_active: boolean
	}): Promise<IPosTechnicianDevicesListResponse> {
		return (
			await $api.get<IPosTechnicianDevicesListResponse>(
				'pos/technician/devices/',
				{
					params: { limit: 100, ...params },
				}
			)
		).data
	}

	static async getDevicesNames(): Promise<IPosDevicesListResponse> {
		return (
			await $api.get<IPosDevicesListResponse>('pos/device-names/', {
				params: { limit: 100 },
			})
		).data
	}

	static async getDeviceById(id: number): Promise<IPosDeviceDetails> {
		return (await $api.get<IPosDeviceDetails>(`pos/devices/${id}/`)).data
	}

	static async getDriverDeviceById(
		id: number
	): Promise<IPosDriverDeviceDetails> {
		return (
			await $api.get<IPosDriverDeviceDetails>(`pos/driver/devices/${id}/`)
		).data
	}

	static async getTechnicianDeviceById(
		id: number
	): Promise<IPosTechnicianDeviceDetails> {
		return (
			await $api.get<IPosTechnicianDeviceDetails>(
				`pos/technician/devices/${id}/`
			)
		).data
	}

	static async updateDevice(
		id: number,
		params: IPosDeviceUpdateParams
	): Promise<IPosDeviceDetails> {
		return (await $api.patch<IPosDeviceDetails>(`pos/devices/${id}/`, params))
			.data
	}

	// Обновление устройства для роли driver
	static async updateDriverDevice(
		id: number,
		params: IPosDriverDeviceUpdateParams
	): Promise<IPosDriverDeviceDetails> {
		return (
			await $api.patch<IPosDriverDeviceDetails>(
				`pos/driver/devices/${id}/`,
				params
			)
		).data
	}

	// Обновление устройства для роли technician
	static async updateTechnicianDevice(
		id: number,
		params: IPosTechnicianDeviceUpdateParams
	): Promise<IPosTechnicianDeviceDetails> {
		return (
			await $api.patch<IPosTechnicianDeviceDetails>(
				`pos/technician/devices/${id}/`,
				params
			)
		).data
	}
}

// PosDevicesService.ts
export class CashCollectionsService {
	static async getCashCollections(
		params: ICashCollectionsParams = {}
	): Promise<ICashCollectionsResponse['data']> {
		const response = await $api.get<ICashCollectionsResponse>(
			'pos/cash-collections/',
			{ params }
		)
		return response.data.data // Повертаємо тільки вміст data
	}
}

export class MaintenanceService {
	static async getMaintenanceHistory(params: {
		date_st?: string
		date_fn?: string
		device_id?: number
		limit?: number
		offset?: number
		status?: 'scheduled' | 'completed'
		type?: string
	}): Promise<MaintenanceResponse> {
		return (
			await $api.get<MaintenanceResponse>('pos/maintenance/', {
				params,
			})
		).data
	}
}
