export interface CurrentDaySummaryResponse {
	data: CurrentDaySummary
	errors: string[]
	status: string
}

export interface CurrentDaySummary {
	sessions: number
	litres: string
	income: string
}

export interface Last30DaysResponse {
	data: Last30DaysData[]
	errors: string[]
	status: string
}

export interface Last30DaysData {
	[date: string]: DailyStats
}

export interface DailyStats {
	sessions: number
	litres: number
	income: number
}

export interface CurrentDailyResponse {
	data: {
		count: number
		next: string
		previous: string
		results: CurrentDailyStats[]
	}
	errors: string[]
	status: string
}

export interface CurrentDailyStats {
	when: string
	sessions: number
	litres: string
	income: string
}

export interface CurrentHourlyResponse {
	data: {
		count: number
		next: string
		previous: string
		results: CurrentHourlyStats[]
	}
	errors: string[]
	status: string
}

export interface CurrentHourlyStats {
	when: string
	sessions: number
	litres: string
	income: string
}

export interface CurrentByVolumeResponse {
	data: {
		count: number
		next: string
		previous: string
		results: CurrentByVolumeStats[]
	}
	errors: string[]
	status: string
}

export interface CurrentByVolumeStats {
	volume: string
	sessions: number
	litres: string
	income: string
}

export interface CurrentByDeviceResponse {
	data: {
		count: number
		next: string
		previous: string
		results: CurrentByDeviceStats[]
	}
	errors: string[]
	status: string
}

export interface CurrentByDeviceStats {
	device_name: string
	sessions: number
	litres: string
	income: string
}

export interface CurrentYearlyResponse {
	data: {
		count: number
		next: string | null
		previous: string | null
		results: CurrentYearlyStats[]
	}
	errors: string[]
	status: string
}

export interface CurrentYearlyStats {
	device_id: string
	year: number
	jan_cash_sales: string
	jan_card_sales: string
	jan_total_sales: string
	feb_cash_sales: string
	feb_card_sales: string
	feb_total_sales: string
	mar_cash_sales: string
	mar_card_sales: string
	mar_total_sales: string
	apr_cash_sales: string
	apr_card_sales: string
	apr_total_sales: string
	may_cash_sales: string
	may_card_sales: string
	may_total_sales: string
	jun_cash_sales: string
	jun_card_sales: string
	jun_total_sales: string
	jul_cash_sales: string
	jul_card_sales: string
	jul_total_sales: string
	aug_cash_sales: string
	aug_card_sales: string
	aug_total_sales: string
	sep_cash_sales: string
	sep_card_sales: string
	sep_total_sales: string
	oct_cash_sales: string
	oct_card_sales: string
	oct_total_sales: string
	nov_cash_sales: string
	nov_card_sales: string
	nov_total_sales: string
	dec_cash_sales: string
	dec_card_sales: string
	dec_total_sales: string
	year_cash_sales: string
	year_card_sales: string
	year_total_sales: string
}

export interface CurrentYearlySummaryResponse {
	data: CurrentYearlySummaryStats
	errors: string[]
	status: string
}

export interface CurrentYearlySummaryStats {
	jan_cash_sales: string
	jan_card_sales: string
	jan_total_sales: string
	feb_cash_sales: string
	feb_card_sales: string
	feb_total_sales: string
	mar_cash_sales: string
	mar_card_sales: string
	mar_total_sales: string
	apr_cash_sales: string
	apr_card_sales: string
	apr_total_sales: string
	may_cash_sales: string
	may_card_sales: string
	may_total_sales: string
	jun_cash_sales: string
	jun_card_sales: string
	jun_total_sales: string
	jul_cash_sales: string
	jul_card_sales: string
	jul_total_sales: string
	aug_cash_sales: string
	aug_card_sales: string
	aug_total_sales: string
	sep_cash_sales: string
	sep_card_sales: string
	sep_total_sales: string
	oct_cash_sales: string
	oct_card_sales: string
	oct_total_sales: string
	nov_cash_sales: string
	nov_card_sales: string
	nov_total_sales: string
	dec_cash_sales: string
	dec_card_sales: string
	dec_total_sales: string
	year_cash_sales: string
	year_card_sales: string
	year_total_sales: string
}
