import { ru } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import StatsService from '../../api/Stats/StatsService'
import { CurrentByDeviceStats } from '../../api/Stats/StatsTypes'
import DeviceStatsTableSection from '../../components/statistics/DeviceStatsTableSection'
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

const DeviceStats = () => {
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
	const [deviceStats, setDeviceStats] = useState<CurrentByDeviceStats[]>([])
	const [totalCount, setTotalCount] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchDeviceStats = async () => {
			setLoading(true)
			setError(null)
			try {
				const dateSt = formatDateToServer(startDate)
				const dateFn = formatDateToServer(endDate)
				const offset = (currentPage - 1) * itemsPerPage
				if (dateSt) {
					console.log('Request params:', { date_st: dateSt, date_fn: dateFn })
					const response = await StatsService.currentByDevice(
						dateSt,
						dateFn || undefined,
						itemsPerPage,
						offset
					)
					setDeviceStats(response.data.results)
					setTotalCount(response.data.count)
					console.log('Device stats fetched:', response.data.results)
					if (response.data.results.length === 0) {
						setError('Нет данных за указанный период')
					}
				}
			} catch (err) {
				console.error('Error fetching device stats:', err)
				setError('Ошибка при загрузке данных')
				setDeviceStats([])
			} finally {
				setLoading(false)
			}
		}

		fetchDeviceStats()
	}, [startDate, endDate, currentPage, itemsPerPage])

	const filteredData = useMemo(() => {
		return deviceStats.map(item => ({
			devices: item.device_name,
			sessions: item.sessions,
			liters: Number(item.litres),
			income: Number(item.income),
		}))
	}, [deviceStats])

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
			<div className='flex items-center gap-2 border-b border-gray-300 pb-2 w-full max-w-52'>
				<DatePicker
					selectsRange
					startDate={startDate}
					endDate={endDate}
					locale={ru}
					onChange={update =>
						setDateRange(update as [Date | null, Date | null])
					}
					isClearable
					dateFormat='dd.MM.yyyy'
					className='px-2 py-1 text-gray-700 bg-transparent w-52 outline-none focus:ring-0 focus:border-transparent'
				/>
			</div>

			{/* График */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white shadow-lg rounded-lg p-3 sm:p-6'
			>
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

				{loading ? (
					<div className='flex justify-center items-center h-[400px]'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
						<p className='ml-2'>Загрузка...</p>
					</div>
				) : error && filteredData.length === 0 ? (
					<p className='text-center text-red-500 p-4'>{error}</p>
				) : (
					<div className='h-[400px]'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={filteredData} layout='vertical'>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis
									type='number'
									domain={[0, yAxisMax]}
									className='text-[12px]'
								/>
								<YAxis
									dataKey='devices'
									type='category'
									width={100}
									className='text-[12px]'
								/>
								<Tooltip
									formatter={value => [
										`${value}`,
										keyToLabel[tabToKey[selectedTab]],
									]}
								/>
								<Bar
									dataKey={tabToKey[selectedTab]}
									name={selectedTab}
									fill='#7c3aed'
									label={{ position: 'insideRight', fill: 'white' }}
									barSize={30}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</motion.div>

			<DeviceStatsTableSection
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

export default DeviceStats
