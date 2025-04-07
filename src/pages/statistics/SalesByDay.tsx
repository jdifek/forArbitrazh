import { ru } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import SalesByDayTableSection from '../../components/statistics/SalesByDayTableSection'
import { useDevice } from '../../helpers/context/DeviceContext'
import { CurrentDailyStats } from '../../api/Stats/StatsTypes'
import StatsService from '../../api/Stats/StatsService'
import { formatDateToServer } from '../../helpers/function/formatDateToServer'

const TABS = [
	{ key: 'sessions', label: 'Сеансы' },
	{ key: 'liters', label: 'Литры' },
	{ key: 'income', label: 'Доход' },
] as const

const tabToKey = {
	Сеансы: 'sessions',
	Литры: 'liters',
	Доход: 'income',
} as const

const keyToLabel = {
	sessions: 'Сеансы',
	liters: 'Литры',
	income: 'Доход',
} as const

const SalesByDay = () => {
	const [selectedTab, setSelectedTab] = useState<'Сеансы' | 'Литры' | 'Доход'>(
		'Литры'
	)
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
		const endDate = new Date()
		const startDate = new Date()
		startDate.setDate(startDate.getDate() - 30)
		return [startDate, endDate]
	})
	const [startDate, endDate] = dateRange
	const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
	const [salesByDayStats, setSalesByDayStats] = useState<CurrentDailyStats[]>(
		[]
	)
	const [totalCount, setTotalCount] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { devices } = useDevice()

	useEffect(() => {
		const fetchSalesByDayStats = async () => {
			setLoading(true)
			setError(null)
			try {
				const dateSt = formatDateToServer(startDate)
				const dateFn = formatDateToServer(endDate)
				const offset = (currentPage - 1) * itemsPerPage

				if (dateSt) {
					console.log('Request params:', {
						date_st: dateSt,
						date_fn: dateFn,
						device_id: selectedDeviceId,
						limit: itemsPerPage,
						offset,
					})
					const response = await StatsService.currentDaily(
						dateSt,
						dateFn || undefined,
						selectedDeviceId || undefined,
						itemsPerPage,
						offset
					)
					setSalesByDayStats(response.data.results)
					setTotalCount(response.data.count)
					console.log('Daily stats fetched:', response.data.results)
					if (response.data.results.length === 0) {
						setError('Нет данных за указанный период')
					}
				}
			} catch (err) {
				console.error('Error fetching daily stats:', err)
				setError('Ошибка при загрузке данных')
				setSalesByDayStats([])
			} finally {
				setLoading(false)
			}
		}

		fetchSalesByDayStats()
	}, [startDate, endDate, selectedDeviceId, currentPage, itemsPerPage])

	const filteredData = useMemo(() => {
		return salesByDayStats.map(item => ({
			date: item.when.split('T')[0]?.substring(5) || item.when,
			sessions: item.sessions,
			liters: Number(item.litres),
			income: Number(item.income),
		}))
	}, [salesByDayStats])

	const maxValue = useMemo(() => {
		const values = filteredData.map(
			item => item[tabToKey[selectedTab]] as number
		)
		return values.length > 0 ? Math.max(...values) : 0
	}, [filteredData, selectedTab])

	const yAxisMax = maxValue > 20000 ? maxValue + 3000 : maxValue + 300

	return (
		<div className='p-6 space-y-6'>
			{/* Фильтры */}
			<div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:justify-between w-full sm:w-auto'>
				<div className='flex items-center gap-2 border-b border-gray-300 pb-2 w-full max-w-52'>
					<DatePicker
						selectsRange
						locale={ru}
						startDate={startDate}
						endDate={endDate}
						onChange={update =>
							setDateRange(update as [Date | null, Date | null])
						}
						isClearable
						dateFormat='dd.MM.yyyy'
						className='px-2 py-1 text-gray-700 bg-transparent w-52 outline-none focus:ring-0 focus:border-transparent'
					/>
				</div>

				<select
					value={selectedDeviceId === null ? 'Усі апарати' : selectedDeviceId}
					onChange={e =>
						setSelectedDeviceId(
							e.target.value === 'Усі апарати' ? null : Number(e.target.value)
						)
					}
					className='border border-gray-300 rounded-lg w-48 py-2 pl-2 pr-4 outline-none text-gray-700'
				>
					<option value='Усі апарати'>Усі апарати</option>
					{devices.map(device => (
						<option key={device.id} value={device.id}>
							{device.name}
						</option>
					))}
				</select>
			</div>

			{/* График */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white shadow-lg rounded-lg p-3 sm:p-6'
			>
				{/* Таб переключения */}
				<div className='flex max-sm:flex-wrap gap-4 mb-6 pb-2'>
					{TABS.map(({ key, label }) => (
						<button
							key={key}
							onClick={() =>
								setSelectedTab(label as 'Сеансы' | 'Литры' | 'Доход')
							}
							className={`px-4 py-2 ${
								selectedTab === label
									? 'text-white bg-blue-500 rounded-full shadow-md p-2'
									: 'bg-gray-200 rounded-full shadow-md p-2'
							}`}
						>
							{label}
						</button>
					))}
				</div>

				{/* График */}
				{loading ? (
					<div className='flex justify-center items-center h-[400px]'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
						<p className='ml-2'>Загрузка...</p>
					</div>
				) : error && filteredData.length === 0 ? (
					<p className='text-center text-red-500 p-4'>{error}</p>
				) : (
					<div className='h-[400px] bg-white shadow-lg rounded-lg p-6'>
						<ResponsiveContainer width='100%' height='100%'>
							<AreaChart data={filteredData}>
								<defs>
									<linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='5%' stopColor='#7c3aed' stopOpacity={0.4} />
										<stop offset='95%' stopColor='#7c3aed' stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='date' className='text-[12px]' />
								<YAxis domain={[0, yAxisMax]} className='text-[12px]' />
								<Tooltip
									formatter={value => [
										`${value}`,
										keyToLabel[tabToKey[selectedTab]],
									]}
								/>
								<Area
									type='monotone'
									dataKey={tabToKey[selectedTab]}
									name={selectedTab}
									stroke='#7c3aed'
									strokeWidth={4}
									fill='url(#colorUv)'
									fillOpacity={1}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				)}
			</motion.div>

			<SalesByDayTableSection
				tableData={filteredData}
				totalCount={totalCount}
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				setCurrentPage={setCurrentPage}
				setItemsPerPage={setItemsPerPage}
				loading={loading}
				error={error}
			/>
		</div>
	)
}

export default SalesByDay
