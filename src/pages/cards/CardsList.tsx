import { ru } from 'date-fns/locale'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FiCheck, FiChevronDown, FiChevronUp, FiPlus } from 'react-icons/fi'
import { CardData } from '../../types'

const CARD_DATA: CardData[] = [
	{
		id: 123,
		date: '2025-01-28 15:57:35',
		number: '0023112930',
		code: '10',
		type: 'Сервисная',
		holder: 'Назва Технік',
		active: true,
		device: '№ 111781',
		address: 'вул. Н, Кривий Ріг, Дніпропетровська о...',
		registered: true,
	},
	{
		id: 120,
		date: '2025-01-27 15:57:35',
		number: '12930',
		code: '8',
		type: 'Сервия',
		holder: 'Назва бред',
		active: true,
		device: '№ 231781',
		address: 'вул. Н, Харків, Дніпропетровська о...',
		registered: true,
	},
	{
		id: 124,
		date: '2025-01-26 14:30:22',
		number: '0023112945',
		code: '12',
		type: 'Обычная',
		holder: 'Інженер А',
		active: false,
		device: '№ 111782',
		address: 'вул. Г, Київ',
		registered: false,
	},
	{
		id: 125,
		date: '2025-01-25 13:45:10',
		number: '0023112946',
		code: '15',
		type: 'Техническая',
		holder: 'Майстер Б',
		active: true,
		device: '№ 111783',
		address: 'вул. Д, Львів',
		registered: true,
	},
	{
		id: 126,
		date: '2025-01-24 12:15:50',
		number: '0023112947',
		code: '7',
		type: 'Диагностическая',
		holder: 'Специалист В',
		active: false,
		device: '№ 111784',
		address: 'вул. Е, Одеса',
		registered: false,
	},
	{
		id: 127,
		date: '2025-01-23 11:50:30',
		number: '0023112948',
		code: '14',
		type: 'Обычная',
		holder: 'Техник Г',
		active: true,
		device: '№ 111785',
		address: 'вул. Ж, Дніпро',
		registered: true,
	},
	{
		id: 128,
		date: '2025-01-22 10:40:20',
		number: '0023112949',
		code: '9',
		type: 'Сервисная',
		holder: 'Назва Сервис',
		active: false,
		device: '№ 111786',
		address: 'вул. З, Запоріжжя',
		registered: false,
	},
	{
		id: 129,
		date: '2025-01-21 09:30:15',
		number: '0023112950',
		code: '11',
		type: 'Диагностическая',
		holder: 'Інженер Д',
		active: true,
		device: '№ 111787',
		address: 'вул. І, Вінниця',
		registered: true,
	},
	{
		id: 130,
		date: '2025-01-20 08:20:05',
		number: '0023112951',
		code: '13',
		type: 'Техническая',
		holder: 'Майстер Е',
		active: false,
		device: '№ 111788',
		address: 'вул. К, Полтава',
		registered: false,
	},
	{
		id: 131,
		date: '2025-01-19 07:10:00',
		number: '0023112952',
		code: '6',
		type: 'Обычная',
		holder: 'Специалист Ж',
		active: true,
		device: '№ 111789',
		address: 'вул. Л, Чернігів',
		registered: true,
	},
]

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]

const TableComponent = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [showRegistered, setShowRegistered] = useState(true)
	const [sortState, setSortState] = useState<{
		column: string | null
		order: 'asc' | 'desc' | null
	}>({ column: null, order: null })
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
		new Date('2025-01-20'),
		new Date('2025-01-29'),
	])
	const [startDate, endDate] = dateRange

	const tableHeaders = showRegistered
		? [
				{ key: 'id', label: 'Id' },
				{ key: 'date', label: 'Дата' },
				{ key: 'number', label: 'Номер' },
				{ key: 'type', label: 'Тип' },
				{ key: 'holder', label: 'Держатель' },
				{ key: 'active', label: 'Активные' },
				{ key: 'device', label: 'Аппарат' },
		  ]
		: [
				{ key: 'id', label: 'Id' },
				{ key: 'date', label: 'Дата' },
				{ key: 'code', label: 'Код' },
				{ key: 'device', label: 'Аппарат' },
				{ key: 'active', label: 'Примечание' },
		  ]

	const filteredByDate = CARD_DATA.filter(item => {
		const itemDate = new Date(item.date)
		if (startDate && endDate) {
			return itemDate >= startDate && itemDate <= endDate
		}
		return true
	})

	const filteredData = filteredByDate
		.filter(item => item.registered === showRegistered)
		.filter(item =>
			Object.values(item).some(value =>
				value.toString().toLowerCase().includes(searchQuery.toLowerCase())
			)
		)

	const sortedData = sortState.column
		? [...filteredData].sort((a, b) => {
				const valueA = a[sortState.column as keyof typeof a]
				const valueB = b[sortState.column as keyof typeof a]

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

	const totalPages = Math.ceil(sortedData.length / itemsPerPage)
	const paginatedData = sortedData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handleSort = (column: keyof (typeof CARD_DATA)[0]) => {
		setSortState(prev => ({
			column,
			order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc',
		}))
	}

	return (
		<div className='p-6 bg-gray-100 min-h-screen'>
			<h2 className='text-xl font-semibold mb-8'>Выбор периода показа</h2>
			<div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:justify-between w-full sm:w-auto mb-6'>
				<select className='border rounded-lg p-2 w-56'>
					<option>Все аппараты</option>
				</select>
				<div className='border-b border-gray-300 pb-2 w-full max-w-52'>
					<DatePicker
						locale={ru}
						selectsRange
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
			</div>

			<div className='bg-white shadow-lg rounded-lg p-4 pt-4'>
				{/* Переключение между "Зарегистрированные карты" и "Неизвестные карты" */}
				<div className='flex max-sm:flex-wrap max-sm:gap-3 space-x-2 mb-4 border-b border-gray-200 pb-5 sm:pl-5'>
					<button
						className={`px-4 py-2 rounded-full text-[14px] ${
							!showRegistered ? 'bg-blue-500 text-white' : 'bg-gray-300'
						}`}
						onClick={() => setShowRegistered(false)}
					>
						НЕИЗВЕСТНЫЕ КАРТЫ
					</button>
					<button
						className={`px-4 py-2 rounded-full text-[14px] ${
							showRegistered ? 'bg-blue-500 text-white' : 'bg-gray-300'
						}`}
						onClick={() => setShowRegistered(true)}
					>
						ЗАРЕГИСТРИРОВАННЫЕ КАРТЫ
					</button>
				</div>

				{/* Верхний блок с селектом и поиском */}
				<div className='flex justify-between items-center mb-3 text-sm md:text-base max-sm:gap-2'>
					<div>
						<span>Показать </span>
						<select
							value={itemsPerPage}
							onChange={e => setItemsPerPage(Number(e.target.value))}
							className='border-b appearance-none border-gray-400 pb-1 text-gray-700 focus:outline-none focus:border-blue-500'
						>
							{ITEMS_PER_PAGE_OPTIONS.map(option => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
						<span> записей</span>
					</div>
					<input
						type='text'
						placeholder='Поиск...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='border-b border-gray-400 py-1 text-gray-700 focus:outline-none focus:border-blue-500 w-full max-sm:max-w-32 max-w-44'
					/>
				</div>

				{/* Таблица */}
				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								{tableHeaders.map(({ key, label }) => (
									<th
										key={key}
										onClick={
											key !== 'active'
												? () => handleSort(key as keyof (typeof CARD_DATA)[0])
												: undefined
										}
										className={`cursor-pointer p-3 lg:p-2 xl:p-3 ${
											showRegistered || key !== 'active' ? '' : 'text-right'
										}`}
									>
										<div className='flex items-center gap-2'>
											{label}
											{key !== 'active' && (
												<div className='flex flex-col'>
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
											)}
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{paginatedData.length > 0 ? (
								paginatedData.map(item => (
									<tr
										key={item.id}
										className='border-b text-[14px] lg:text-[12px] xl:text-[14px]'
									>
										{tableHeaders.map(({ key }) => (
											<td
												key={key}
												className={`px-4 lg:px-2 xl:px-4 py-2 ${
													key === 'active' && !showRegistered
														? 'text-right'
														: ''
												}`}
											>
												{typeof item[key as keyof CardData] === 'boolean' ? (
													item[key as keyof CardData] ? (
														<FiCheck className='text-blue-600' />
													) : (
														<FiPlus className='text-blue-600' />
													)
												) : (
													item[key as keyof CardData]
												)}
											</td>
										))}
									</tr>
								))
							) : (
								<tr>
									<td colSpan={8} className='p-3 text-center text-gray-500'>
										Ничего не найдено
									</td>
								</tr>
							)}
						</tbody>
						<tfoot>
							<tr>
								{tableHeaders.map(({ key, label }) => (
									<th
										key={key}
										onClick={() =>
											handleSort(key as keyof (typeof CARD_DATA)[0])
										}
										className='cursor-pointer p-3'
									>
										<div className='flex items-center gap-2'>{label}</div>
									</th>
								))}
							</tr>
						</tfoot>
					</table>
				</div>

				{/* Нижняя панель с записями и пагинацией */}
				<div className='flex justify-between items-center mt-4'>
					<p className='text-gray-600 text-sm md:text-base'>
						Записи с{' '}
						{Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)}{' '}
						до {Math.min(currentPage * itemsPerPage, sortedData.length)} из{' '}
						{sortedData.length} записей
					</p>

					{/* Пагинация */}
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
						{[...Array(totalPages)].map((_, i) => (
							<button
								key={i}
								onClick={() => setCurrentPage(i + 1)}
								className={`px-4 py-1 rounded-full text-[12px] ${
									currentPage === i + 1
										? 'bg-blue-500 text-white'
										: 'bg-gray-200 hover:bg-gray-300'
								}`}
							>
								{i + 1}
							</button>
						))}
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
			</div>
		</div>
	)
}

export default TableComponent
