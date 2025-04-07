// Statistics - Sales statistics
export type SaleTableData = {
	id: string
	date: string
	cost: number
	issued: number
	ordered: number
	product: string
	payment: string
	store: string
}

// Statistics - Sales by day
export type SalesByDayTableData = {
	date: string
	sessions: number
	liters: number
	income: number
}

// Statistics - Daily stats
export type DailyStatsRow = {
	date: string
	sessions: number
	liters: number
	income: number
}

export type DailyStatsSortDirection = 'asc' | 'desc'

// Statistics - Daily stats
export type DeviceStatsTableData = {
	devices: string
	sessions: number
	liters: number
	income: number
}

// Statistics - Collection
export type CollectionTableData = {
	id: number
	date: string
	device: string
	type: string
	collector: string
	quantity: number
	amount: number
}

// Statistics - Liter stats
export type LiterStatsTableData = {
	container: string
	sessions: number
	liters: number
}

// Statistics - Yearly report
export type YearlyReportRow = {
	type: string
	january: string
	february: string
	march: string
	april: string
	may: string
	june: string
	july: string
	august: string
	september: string
	october: string
	november: string
	december: string
	total: string
}

export type YearlyReportData = {
	id: string
	location: string
	serial: string
	rows: YearlyReportRow[]
}

// Cards - Card list
export type CardData = {
	id: number
	date: string
	number: string
	code: string
	type: string
	holder: string
	active: boolean
	device: string
	address: string
	registered: boolean
}

// Maintenance history
export type MaintenanceRecord = {
	id: number
	assigned_to: {
		id: number
		full_name: string
	}
	device: {
		id: number
		name: string
	}
	created_at: string
	deadline: string
	planned_for: string
	completed_at: string
	type: string
	status: 'scheduled' | 'completed'
}
