import { motion } from 'framer-motion'
import { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'
import { LiterStatsTableData } from '../../types'
import usePagination from '../../helpers/hooks/usePagination'

interface LiterStatsTableSectionProps {
	tableData: LiterStatsTableData[]
	totalCount: number
	currentPage: number
	itemsPerPage: number
	setCurrentPage: (page: number) => void
	setItemsPerPage: (items: number) => void
	loading: boolean
	error: string | null
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]

const LiterStatsTableSection = ({
	tableData,
	totalCount,
	currentPage,
	itemsPerPage,
	setCurrentPage,
	setItemsPerPage,
	loading,
	error,
}: LiterStatsTableSectionProps) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [sortState, setSortState] = useState<{
		column: keyof (typeof tableData)[0]
		order: 'asc' | 'desc' | null
	}>({
		column: 'container',
		order: null,
	})

	const filteredData = tableData.filter(item =>
		Object.values(item).some(value =>
			value.toString().toLowerCase().includes(searchQuery.toLowerCase())
		)
	)

	const sortedData = sortState.order
		? [...filteredData].sort((a, b) => {
				const valueA = a[sortState.column as keyof typeof a]
				const valueB = b[sortState.column as keyof typeof b]

				if (typeof valueA === 'number' && typeof valueB === 'number') {
					return sortState.order === 'asc' ? valueA - valueB : valueB - valueA
				} else if (typeof valueA === 'string' && typeof valueB === 'string') {
					return sortState.order === 'asc'
						? valueA.localeCompare(valueB)
						: valueB.localeCompare(valueA)
				}
				return 0
		  })
		: filteredData

	const totalPages = Math.ceil(totalCount / itemsPerPage)
	const paginationRange = usePagination(totalPages, currentPage)

	const totalSessions = filteredData.reduce(
		(sum, item) => sum + item.sessions,
		0
	)
	const totalLiters = filteredData.reduce((sum, item) => sum + item.liters, 0)

	const handleSort = (column: keyof LiterStatsTableData) => {
		setSortState(prev => ({
			column,
			order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc',
		}))
	}

	const handleExportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(tableData)
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Volume Stats')
		XLSX.writeFile(workbook, 'volume_stats.xlsx')
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='bg-white shadow-lg rounded-lg p-3 sm:p-6 mt-6'
		>
			{/* Верхняя панель */}
			<div className='flex justify-between items-center mb-4 max-sm:gap-3'>
				<div>
					<button
						onClick={handleExportToExcel}
						className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition text-sm sm:text-base'
					>
						<FiDownload size={18} /> Экспорт
					</button>

					<div className='relative mt-4 text-sm md:text-base max-sm:gap-2'>
						<span>Показать </span>
						<select
							value={itemsPerPage}
							onChange={e => {
								setItemsPerPage(Number(e.target.value))
								setCurrentPage(1)
							}}
							className='appearance-none border-b border-gray-400 pb-1 text-gray-700 focus:outline-none focus:border-blue-500'
						>
							{ITEMS_PER_PAGE_OPTIONS.map(option => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
						<span> записей</span>
					</div>
				</div>

				<input
					type='text'
					placeholder='Поиск...'
					value={searchQuery}
					onChange={e => {
						setSearchQuery(e.target.value)
						setCurrentPage(1)
					}}
					className='border-b border-gray-400 py-1 text-gray-700 focus:outline-none focus:border-blue-500 w-full max-sm:max-w-32 max-w-44'
				/>
			</div>

			{/* Таблица */}
			{loading ? (
				<div className='flex justify-center items-center h-[200px]'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
					<p className='ml-2'>Загрузка...</p>
				</div>
			) : error && sortedData.length === 0 ? (
				<p className='text-center text-red-500 p-4'>{error}</p>
			) : (
				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr className='font-medium text-lg'>
								<td></td>
								<td className='p-3 text-center'>{totalSessions.toFixed(1)}</td>
								<td className='p-3 text-right'>{totalLiters.toFixed(1)} л</td>
							</tr>
							<tr className='text-gray-700'>
								{['Тара', 'Сеансы', 'Литров'].map((header, index) => {
									const key = ['container', 'sessions', 'liters'][
										index
									] as keyof LiterStatsTableData
									return (
										<th
											key={header}
											className={`p-3 cursor-pointer ${
												index === 0
													? 'text-left'
													: index === 1
													? 'text-center'
													: 'text-right'
											}`}
											onClick={() => handleSort(key)}
										>
											<div
												className={`flex items-center ${
													index === 0
														? 'justify-start'
														: index === 1
														? 'justify-center'
														: 'justify-end'
												}`}
											>
												{header}
												<div className='ml-2'>
													<FiChevronUp
														size={14}
														className={
															sortState.column === key &&
															sortState.order === 'asc'
																? 'text-blue-500'
																: 'text-gray-400'
														}
													/>
													<FiChevronDown
														size={14}
														className={
															sortState.column === key &&
															sortState.order === 'desc'
																? 'text-blue-500'
																: 'text-gray-400'
														}
													/>
												</div>
											</div>
										</th>
									)
								})}
							</tr>
						</thead>
						<tbody>
							{sortedData.length > 0 ? (
								sortedData.map((row, index) => (
									<motion.tr
										key={index}
										className='border-b border-gray-200 hover:bg-gray-100 text-[14px]'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										<td className='p-3 text-left'>{row.container}</td>
										<td className='p-3 text-center'>{row.sessions}</td>
										<td className='p-3 text-right'>{row.liters}</td>
									</motion.tr>
								))
							) : (
								<tr>
									<td colSpan={3} className='p-3 text-center text-gray-500'>
										Ничего не найдено
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}

			{/* Нижняя панель с записями и пагинацией */}
			<div className='flex justify-between items-center mt-4'>
				<p className='text-gray-600 text-sm md:text-base'>
					Записи с {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}{' '}
					до {Math.min(currentPage * itemsPerPage, totalCount)} из {totalCount}{' '}
					записей
				</p>

				<div className='flex max-xl:flex-wrap justify-end gap-2'>
					<button
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}
						className='p-2 hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base'
					>
						Первая
					</button>
					<button
						onClick={() => setCurrentPage(currentPage - 1)}
						disabled={currentPage === 1}
						className='p-2 hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base'
					>
						Предыдущая
					</button>
					{paginationRange.map((page, index) =>
						typeof page === 'number' ? (
							<button
								key={index}
								onClick={() => setCurrentPage(page)}
								className={`px-4 py-1 rounded-full text-[12px] ${
									currentPage === page
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 hover:bg-gray-300'
								}`}
							>
								{page}
							</button>
						) : (
							<span key={index} className='px-4 py-1 text-[12px]'>
								...
							</span>
						)
					)}
					<button
						onClick={() => setCurrentPage(currentPage + 1)}
						disabled={currentPage === totalPages}
						className='p-2 hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base'
					>
						Следующая
					</button>
					<button
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages}
						className='p-2 hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base'
					>
						Последняя
					</button>
				</div>
			</div>
		</motion.div>
	)
}

export default LiterStatsTableSection
