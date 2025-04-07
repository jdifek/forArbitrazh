import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'
import { YearlyReportData } from '../..'
import StatsService from '../../api/Stats/StatsService'
import { CurrentYearlyStats } from '../../api/Stats/StatsTypes'
import { useDevice } from '../../helpers/context/DeviceContext'

const YearlyReport = () => {
	const [selectedYear, setSelectedYear] = useState<number>(2025)
	const [yearlyData, setYearlyData] = useState<YearlyReportData[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isScrolled, setIsScrolled] = useState(false)
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const { devices } = useDevice()

	useEffect(() => {
		const handleScroll = () => {
			if (scrollContainerRef.current) {
				setIsScrolled(scrollContainerRef.current.scrollLeft > 0)
			}
		}

		const scrollContainer = scrollContainerRef.current
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll)
		}

		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener('scroll', handleScroll)
			}
		}
	}, [])

	useEffect(() => {
		const fetchYearlyReport = async () => {
			setLoading(true)
			setError(null)
			try {
				const [yearlyResponse, summaryResponse] = await Promise.all([
					StatsService.currentYearly(selectedYear),
					StatsService.currentYearlySummary(selectedYear),
				])

				const yearlyStats = yearlyResponse.data.results
				const summaryStats = summaryResponse.data

				// Преобразуем данные по устройствам из currentYearly
				const deviceData = yearlyStats.map((item: CurrentYearlyStats) => {
					// Находим устройство по device_id в списке devices
					const device = devices.find(d => d.id.toString() === item.device_id)
					return {
						id: item.device_id,
						location: device?.name || item.device_id, // пока так, потом исправлю
						serial: device?.serial_number || item.device_id, // пока так, потом исправлю
						rows: [
							{
								type: 'Готівка',
								january: item.jan_cash_sales,
								february: item.feb_cash_sales,
								march: item.mar_cash_sales,
								april: item.apr_cash_sales,
								may: item.may_cash_sales,
								june: item.jun_cash_sales,
								july: item.jul_cash_sales,
								august: item.aug_cash_sales,
								september: item.sep_cash_sales,
								october: item.oct_cash_sales,
								november: item.nov_cash_sales,
								december: item.dec_cash_sales,
								total: item.year_cash_sales,
							},
							{
								type: 'Безготівка',
								january: item.jan_card_sales,
								february: item.feb_card_sales,
								march: item.mar_card_sales,
								april: item.apr_card_sales,
								may: item.may_card_sales,
								june: item.jun_card_sales,
								july: item.jul_card_sales,
								august: item.aug_card_sales,
								september: item.sep_card_sales,
								october: item.oct_card_sales,
								november: item.nov_card_sales,
								december: item.dec_card_sales,
								total: item.year_card_sales,
							},
							{
								type: 'Дохід',
								january: item.jan_total_sales,
								february: item.feb_total_sales,
								march: item.mar_total_sales,
								april: item.apr_total_sales,
								may: item.may_total_sales,
								june: item.jun_total_sales,
								july: item.jul_total_sales,
								august: item.aug_total_sales,
								september: item.sep_total_sales,
								october: item.oct_total_sales,
								november: item.nov_total_sales,
								december: item.dec_total_sales,
								total: item.year_total_sales,
							},
						],
					}
				})

				// Преобразуем итоговые данные из currentYearlySummary
				const summaryData: YearlyReportData = {
					id: '',
					location: 'Загальна сума за місяць',
					serial: '',
					rows: [
						{
							type: 'Готівка',
							january: summaryStats.jan_cash_sales,
							february: summaryStats.feb_cash_sales,
							march: summaryStats.mar_cash_sales,
							april: summaryStats.apr_cash_sales,
							may: summaryStats.may_cash_sales,
							june: summaryStats.jun_cash_sales,
							july: summaryStats.jul_cash_sales,
							august: summaryStats.aug_cash_sales,
							september: summaryStats.sep_cash_sales,
							october: summaryStats.oct_cash_sales,
							november: summaryStats.nov_cash_sales,
							december: summaryStats.dec_cash_sales,
							total: summaryStats.year_cash_sales,
						},
						{
							type: 'Безготівка',
							january: summaryStats.jan_card_sales,
							february: summaryStats.feb_card_sales,
							march: summaryStats.mar_card_sales,
							april: summaryStats.apr_card_sales,
							may: summaryStats.may_card_sales,
							june: summaryStats.jun_card_sales,
							july: summaryStats.jul_card_sales,
							august: summaryStats.aug_card_sales,
							september: summaryStats.sep_cash_sales,
							october: summaryStats.oct_card_sales,
							november: summaryStats.nov_card_sales,
							december: summaryStats.dec_card_sales,
							total: summaryStats.year_card_sales,
						},
						{
							type: 'Дохід',
							january: summaryStats.jan_total_sales,
							february: summaryStats.feb_total_sales,
							march: summaryStats.mar_total_sales,
							april: summaryStats.apr_total_sales,
							may: summaryStats.may_total_sales,
							june: summaryStats.jun_total_sales,
							july: summaryStats.jul_total_sales,
							august: summaryStats.aug_total_sales,
							september: summaryStats.sep_total_sales,
							october: summaryStats.oct_total_sales,
							november: summaryStats.nov_total_sales,
							december: summaryStats.dec_total_sales,
							total: summaryStats.year_total_sales,
						},
					],
				}

				// Объединяем данные по устройствам и итоговую сумму
				setYearlyData([...deviceData, summaryData])
				console.log('Yearly data fetched:', [...deviceData, summaryData])
			} catch (err) {
				console.error('Error fetching yearly report:', err)
				setError('Ошибка при загрузке данных')
				setYearlyData([])
			} finally {
				setLoading(false)
			}
		}

		fetchYearlyReport()
	}, [selectedYear, devices])

	const handleExportToExcel = () => {
		const flatData = yearlyData.flatMap(item =>
			item.rows.map(row => ({
				ID: item.id,
				'Торговая точка': item.location,
				'Серийный номер': item.serial,
				Тип: row.type,
				Январь: row.january,
				Февраль: row.february,
				Март: row.march,
				Апрель: row.april,
				Май: row.may,
				Июнь: row.june,
				Июль: row.july,
				Август: row.august,
				Сентябрь: row.september,
				Октябрь: row.october,
				Ноябрь: row.november,
				Декабрь: row.december,
				Сумма: row.total,
			}))
		)

		const ws = XLSX.utils.json_to_sheet(flatData)
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, 'Yearly Report')
		XLSX.writeFile(wb, `yearly_report_${selectedYear}.xlsx`)
	}

	const commonCellClasses = 'border px-4 py-2'
	const fixedColumnClasses = `${commonCellClasses} bg-white`
	const headerClasses = `${commonCellClasses} bg-gray-100 font-medium`
	const scrollableColumnClasses = `${commonCellClasses} text-left whitespace-nowrap`

	return (
		<div className='p-4 space-y-6 w-full max-w-7xl mx-auto'>
			<div className='flex justify-between items-center'>
				<select
					className='border rounded px-3 py-1 w-40'
					value={selectedYear}
					onChange={e => setSelectedYear(Number(e.target.value))}
				>
					<option value={2023}>2023</option>
					<option value={2024}>2024</option>
					<option value={2025}>2025</option>
				</select>

				<button
					onClick={handleExportToExcel}
					className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition'
				>
					<FiDownload size={18} /> Экспорт
				</button>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-white shadow-lg rounded-lg p-6 w-full mx-auto sm:max-w-[640px] md:max-w-full lg:max-w-[700px] max-w-1lg_sm max-w-1_5lg_sm max-w-2lg_sm max-w-2_5lg_sm max-w-3lg_sm max-w-3_5lg_sm max-w-4lg_sm xl:max-w-[980px] max-w-0_6xl  max-w-0_9xl max-w-1_3xl max-w-1_6xl max-w-1_9xl 2xl:max-w-full'
			>
				{loading ? (
					<div className='flex justify-center items-center h-[400px]'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
						<p className='ml-2'>Загрузка...</p>
					</div>
				) : error ? (
					<p className='text-center text-red-500 p-4'>{error}</p>
				) : (
					<div className='relative'>
						{/* Fixed Columns Container */}
						<div className='absolute left-0 top-0 z-20 bg-white'>
							<table className='border-collapse text-sm'>
								<thead>
									<tr>
										<th className={`${headerClasses} text-left w-[55px]`}>
											ID
										</th>
										<th className={`${headerClasses} text-left w-[140px]`}>
											Торговая точка
										</th>
										<th
											className={`${headerClasses} text-left w-[97px] whitespace-nowrap`}
										>
											Серийный номер
										</th>
										<th className={`${headerClasses} text-left w-[99px]`}>
											Тип
										</th>
									</tr>
								</thead>
								<tbody>
									{yearlyData.map((item, itemIndex) =>
										item.rows.map((row, rowIndex) => (
											<tr key={`fixed-${itemIndex}-${rowIndex}`}>
												{rowIndex === 0 && (
													<>
														<td
															className={`${fixedColumnClasses} w-[55px]`}
															rowSpan={3}
														>
															{item.id}
														</td>
														<td
															className={`${fixedColumnClasses} w-[140px]`}
															rowSpan={3}
														>
															{item.location}
														</td>
														<td
															className={`${fixedColumnClasses} w-[97px]`}
															rowSpan={3}
														>
															{item.serial}
														</td>
													</>
												)}
												<td className={`${fixedColumnClasses} w-[99px]`}>
													{row.type}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{/* Scrollable Container */}
						<div
							ref={scrollContainerRef}
							className='overflow-x-scroll scrollbar-hide'
							style={{ marginLeft: '442px' }}
						>
							<style>
								{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: block;
                  }
                `}
							</style>
							<table className='w-full border-collapse text-sm'>
								<thead>
									<tr>
										{[
											'Январь',
											'Февраль',
											'Март',
											'Апрель',
											'Май',
											'Июнь',
											'Июль',
											'Август',
											'Сентябрь',
											'Октябрь',
											'Ноябрь',
											'Декабрь',
											'Сумма',
										].map(month => (
											<th key={month} className={`${headerClasses} w-[100px]`}>
												{month}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{yearlyData.map((item, itemIndex) =>
										item.rows.map((row, rowIndex) => (
											<tr key={`scroll-${itemIndex}-${rowIndex}`}>
												<td className={scrollableColumnClasses}>
													{row.january}
												</td>
												<td className={scrollableColumnClasses}>
													{row.february}
												</td>
												<td className={scrollableColumnClasses}>{row.march}</td>
												<td className={scrollableColumnClasses}>{row.april}</td>
												<td className={scrollableColumnClasses}>{row.may}</td>
												<td className={scrollableColumnClasses}>{row.june}</td>
												<td className={scrollableColumnClasses}>{row.july}</td>
												<td className={scrollableColumnClasses}>
													{row.august}
												</td>
												<td className={scrollableColumnClasses}>
													{row.september}
												</td>
												<td className={scrollableColumnClasses}>
													{row.october}
												</td>
												<td className={scrollableColumnClasses}>
													{row.november}
												</td>
												<td className={scrollableColumnClasses}>
													{row.december}
												</td>
												<td className={scrollableColumnClasses}>{row.total}</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</motion.div>
		</div>
	)
}

export default YearlyReport
