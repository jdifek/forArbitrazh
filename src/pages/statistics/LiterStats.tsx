import { ru } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import StatsService from '../../api/Stats/StatsService'
import { CurrentByVolumeStats } from '../../api/Stats/StatsTypes'
import LiterStatsTableSection from '../../components/statistics/LiterStatsTableSection'
import { useDevice } from '../../helpers/context/DeviceContext'
import { formatDateToServer } from '../../helpers/function/formatDateToServer'

const TABS = [
	{ key: 'sessions', label: 'Сеансы' },
	{ key: 'liters', label: 'Литры' },
] as const

const tabToKey = {
	Сеансы: 'sessions',
	Литры: 'liters',
} as const

const keyToLabel = {
	sessions: 'Сеансы',
	liters: 'Литры',
} as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomizedAxisTick: FunctionComponent<any> = (props: any) => {
	const { x, y, payload } = props

	return (
		<g transform={`translate(${x},${y})`}>
			<text
				x={0}
				y={0}
				dy={16}
				textAnchor='end'
				fill='#666'
				transform='rotate(-35)'
			>
				{payload.value}
			</text>
		</g>
	)
}

const LiterStats = () => {
	const [selectedTab, setSelectedTab] = useState<'Сеансы' | 'Литры'>('Сеансы')
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
		const endDate = new Date()
		const startDate = new Date()
		startDate.setDate(startDate.getDate() - 30)
		return [startDate, endDate]
	})
	const [startDate, endDate] = dateRange
	const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
	const [volumeStats, setVolumeStats] = useState<CurrentByVolumeStats[]>([])
	const [totalCount, setTotalCount] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { devices } = useDevice()

	useEffect(() => {
		const fetchVolumeStats = async () => {
			setLoading(true)
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
					const response = await StatsService.currentByVolume(
						dateSt,
						dateFn || undefined,
						selectedDeviceId || undefined,
						itemsPerPage,
						offset
					)
					setVolumeStats(response.data.results)
					setTotalCount(response.data.count)
					console.log('Volume stats fetched:', response.data.results)
					if (response.data.results.length === 0) {
						setError('Нет данных за указанный период')
					} else {
						setError(null)
					}
				}
			} catch (err) {
				console.error('Error fetching volume stats:', err)
				setError('Ошибка при загрузке данных')
				setVolumeStats([])
			} finally {
				setLoading(false)
			}
		}

		fetchVolumeStats()
	}, [startDate, endDate, selectedDeviceId, currentPage, itemsPerPage])

	const filteredData = useMemo(() => {
		return volumeStats.map(item => ({
			container: item.volume,
			sessions: item.sessions,
			liters: Number(item.litres),
		}))
	}, [volumeStats])

	const maxValue = useMemo(() => {
		const values = filteredData.map(
			item => item[tabToKey[selectedTab]] as number
		)
		return values.length > 0 ? Math.max(...values) : 0
	}, [filteredData, selectedTab])

	const yAxisMax =
		maxValue > 20000
			? maxValue + 3000
			: maxValue <= 200
			? maxValue + 20
			: maxValue <= 1000
			? maxValue + 50
			: maxValue + 100

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
				<div className='flex gap-4 mb-6 pb-2'>
					{TABS.map(({ key, label }) => (
						<button
							key={key}
							onClick={() => setSelectedTab(label as 'Сеансы' | 'Литры')}
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
					<div className='h-[400px]'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={filteredData}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis
									dataKey='container'
									tick={<CustomizedAxisTick />}
									className='text-[12px]'
								/>
								<YAxis domain={[0, yAxisMax]} className='text-[12px]' />
								<Tooltip
									formatter={value => [
										`${value}`,
										keyToLabel[tabToKey[selectedTab]],
									]}
								/>
								<Legend />
								{/* Столбцы графика */}
								<Bar
									dataKey={tabToKey[selectedTab]}
									name={selectedTab}
									fill='#7c3aed'
									barSize={30}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</motion.div>

			<LiterStatsTableSection
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

export default LiterStats
