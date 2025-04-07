import { motion } from 'framer-motion'
import { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'
import { DailyStatsRow } from '../../types'

interface DailyStatsTableSectionProps {
	hourlyStats: DailyStatsRow[]
}

const DailyStatsTableSection = ({
	hourlyStats,
}: DailyStatsTableSectionProps) => {
	const [sortState, setSortState] = useState<{
		column: string | null
		order: 'asc' | 'desc' | null
	}>({ column: null, order: null })

	const handleSort = (column: keyof DailyStatsRow) => {
		setSortState(prev => ({
			column,
			order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc',
		}))
	}

	const sortedData = sortState.column
		? [...hourlyStats].sort((a, b) => {
				const valueA = a[sortState.column as keyof DailyStatsRow]
				const valueB = b[sortState.column as keyof DailyStatsRow]

				if (sortState.column === 'date') {
					// Сортировка времени в формате "HH:MM" по порядку суток
					const timeA = valueA as string
					const timeB = valueB as string
					const [hoursA, minutesA] = timeA.split(':').map(Number)
					const [hoursB, minutesB] = timeB.split(':').map(Number)
					const totalMinutesA = hoursA * 60 + minutesA
					const totalMinutesB = hoursB * 60 + minutesB

					return sortState.order === 'asc'
						? totalMinutesA - totalMinutesB
						: totalMinutesB - totalMinutesA
				}

				// Обычная сортировка для числовых полей
				if (typeof valueA === 'number' && typeof valueB === 'number') {
					return sortState.order === 'asc' ? valueA - valueB : valueB - valueA
				}

				// Сортировка строк (если вдруг другие поля станут строками)
				if (typeof valueA === 'string' && typeof valueB === 'string') {
					return sortState.order === 'asc'
						? valueA.localeCompare(valueB)
						: valueB.localeCompare(valueA)
				}

				return 0
		  })
		: hourlyStats

	const totalSessions = hourlyStats.reduce(
		(sum, item) => sum + item.sessions,
		0
	)
	const totalLiters = hourlyStats.reduce((sum, item) => sum + item.liters, 0)
	const totalIncome = hourlyStats.reduce((sum, item) => sum + item.income, 0)

	const handleExportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(sortedData)
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data')
		XLSX.writeFile(workbook, 'sales_data.xlsx')
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='bg-white shadow-lg rounded-lg p-6 mt-6'
		>
			{/* Верхняя панель */}
			<div className='flex justify-between items-center mb-8 max-sm:gap-3'>
				<button
					onClick={handleExportToExcel}
					className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition text-sm sm:text-base'
				>
					<FiDownload size={18} /> Экспорт
				</button>
			</div>

			{/* Таблица */}
			<div className='overflow-x-auto'>
				<table className='w-full border-collapse text-left'>
					<thead>
						<tr className='font-medium text-lg'>
							<td></td>
							<td className='p-3'>{totalSessions.toFixed(1)}</td>
							<td className='p-3'>{totalLiters.toFixed(1)} л</td>
							<td className='p-3'>{totalIncome.toFixed(1)} (₴)</td>
						</tr>
						<tr>
							{['date', 'sessions', 'liters', 'income'].map(key => (
								<th
									key={key}
									className='p-3 cursor-pointer'
									onClick={() => handleSort(key as keyof DailyStatsRow)}
								>
									<div className='flex items-center gap-2 text-base font-medium'>
										{key === 'date'
											? 'Время'
											: key === 'sessions'
											? 'Сеансы'
											: key === 'liters'
											? 'Литров'
											: 'Доход'}
										<div className='flex flex-col'>
											<FiChevronUp
												size={14}
												className={
													sortState.column === key && sortState.order === 'asc'
														? 'text-blue-500'
														: 'text-gray-400'
												}
											/>
											<FiChevronDown
												size={14}
												className={
													sortState.column === key && sortState.order === 'desc'
														? 'text-blue-500'
														: 'text-gray-400'
												}
											/>
										</div>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sortedData.length > 0 ? (
							sortedData.map((row, index) => (
								<tr
									key={index}
									className='border-b border-gray-200 hover:bg-gray-100 text-[14px]'
								>
									<td className='p-3'>
										<span>{row.date}</span>
									</td>
									<td className='p-3'>{row.sessions}</td>
									<td className='p-3'>{row.liters}</td>
									<td className='p-3'>{row.income}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className='p-3 text-center text-gray-500'>
									Нет данных
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</motion.div>
	)
}

export default DailyStatsTableSection
