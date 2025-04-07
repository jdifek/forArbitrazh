import $api from '../http'
import {
	CurrentByDeviceResponse,
	CurrentByVolumeResponse,
	CurrentDailyResponse,
	CurrentDaySummaryResponse,
	CurrentHourlyResponse,
	CurrentYearlyResponse,
	CurrentYearlySummaryResponse,
	Last30DaysResponse,
} from './StatsTypes'

export default class StatsService {
	static async currentDaySummary(): Promise<CurrentDaySummaryResponse> {
		return (
			await $api.get<CurrentDaySummaryResponse>(
				'stats/general/current-day-summary/'
			)
		).data
	}
	static async currentLast(): Promise<Last30DaysResponse> {
		return (await $api.get<Last30DaysResponse>('stats/general/last-30-days/'))
			.data
	}

	static async currentDaily(
		dateSt: string,
		dateFn?: string,
		deviceId?: number,
		limit?: number,
		offset?: number
	): Promise<CurrentDailyResponse> {
		return (
			await $api.get<CurrentDailyResponse>('stats/daily/', {
				params: {
					date_st: dateSt,
					date_fn: dateFn,
					device_id: deviceId,
					limit: limit || 31,
					offset: offset || 0,
				},
			})
		).data
	}

	static async currentHourly(
		dateSt: string,
		dateFn?: string,
		deviceId?: number,
		limit?: number
	): Promise<CurrentHourlyResponse> {
		return (
			await $api.get<CurrentHourlyResponse>('stats/hourly/', {
				params: {
					date_st: dateSt,
					date_fn: dateFn,
					device_id: deviceId,
					limit: limit || 100,
				},
			})
		).data
	}
	static async currentByVolume(
		dateSt: string,
		dateFn?: string,
		deviceId?: number,
		limit?: number,
		offset?: number
	): Promise<CurrentByVolumeResponse> {
		return (
			await $api.get<CurrentByVolumeResponse>('stats/by-volume/', {
				params: {
					date_st: dateSt,
					date_fn: dateFn,
					device_id: deviceId,
					limit,
					offset,
				},
			})
		).data
	}

	static async currentByDevice(
		dateSt: string,
		dateFn?: string,
		limit?: number,
		offset?: number
	): Promise<CurrentByDeviceResponse> {
		return (
			await $api.get<CurrentByDeviceResponse>('stats/by-device/', {
				params: {
					date_st: dateSt,
					date_fn: dateFn,
					limit: limit || 9999,
					offset: offset || 0,
				},
			})
		).data
	}

	static async currentYearly(
		year: number,
		offset?: number
	): Promise<CurrentYearlyResponse> {
		return (
			await $api.get<CurrentYearlyResponse>('stats/yearly/', {
				params: {
					year,
					limit: 100,
					offset,
				},
			})
		).data
	}

	static async currentYearlySummary(
		year: number,
		offset?: number
	): Promise<CurrentYearlySummaryResponse> {
		return (
			await $api.get<CurrentYearlySummaryResponse>('stats/yearly-summary/', {
				params: {
					year,
					limit: 100,
					offset,
				},
			})
		).data
	}
}
