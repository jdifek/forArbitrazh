import { useEffect, useState } from 'react'
import OrdersService from '../../api/Order/orderService'
import { IOrder } from '../../api/Order/orderTypes'
import StatisticsFilter from '../../components/statistics/StatisticsFilter'
import StatisticsTable from '../../components/statistics/StatisticsTable'
import { SaleTableData } from '../../types'
import usePagination from '../../helpers/hooks/usePagination'
import { formatDateToServer } from '../../helpers/function/formatDateToServer'

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]

const SalesPage = () => {
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [currentPage, setCurrentPage] = useState(1)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortState, setSortState] = useState<{
		column: string | null
		order: 'asc' | 'desc' | null
	}>({ column: null, order: null })
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
		const endDate = new Date()
		const startDate = new Date()
		startDate.setDate(startDate.getDate() - 30)
		return [startDate, endDate]
	})
	const [startDate, endDate] = dateRange
	const [selectedStore, setSelectedStore] =
		useState<string>('Все торговые точки')
	const [selectedPayment, setSelectedPayment] = useState<string>('Все типы')
	const [selectedProduct, setSelectedProduct] = useState<string>('Все товары')
	const [salesData, setSalesData] = useState<SaleTableData[]>([])
	const [totalCount, setTotalCount] = useState(0)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	// Маппинг фронтенд-полей на серверные поля
	const sortFieldMapping = {
		id: 'id',
		date: 'completed_at',
		cost: 'total_price',
		issued: 'product_quantity_delivered',
		ordered: 'product_quantity_ordered',
		product: 'product_name',
		payment: 'payment_type',
		store: 'device_name',
	}

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true)
			setError(null)
			try {
				const dateSt = formatDateToServer(startDate)
				const dateFn = formatDateToServer(endDate)
				const offset = (currentPage - 1) * itemsPerPage

				const deviceId =
					selectedStore !== 'Все торговые точки'
						? Number(selectedStore)
						: undefined

				const params = {
					date_st: dateSt,
					date_fn: dateFn,
					limit: itemsPerPage,
					offset: offset,
					device_id: deviceId,
					payment_type:
						selectedPayment !== 'Все типы'
							? selectedPayment === 'Наличные'
								? 'cash'
								: 'card'
							: undefined,
					o:
						sortState.column && sortFieldMapping[sortState.column]
							? `${sortState.order === 'desc' ? '-' : ''}${
									sortFieldMapping[sortState.column]
							  }`
							: undefined,
				}

				console.log('Request params:', params)
				const res = await OrdersService.getOrders(params)
				const serverData: IOrder[] = res.data.results
				setTotalCount(res.data.count)

				const transformedData: SaleTableData[] = serverData.map(order => ({
					id: order.id.toString(),
					date: order.completed_at,
					cost: parseFloat(order.total_price),
					issued: parseFloat(order.product_quantity_delivered),
					ordered: parseFloat(order.product_quantity_ordered),
					product: order.product_name,
					payment: order.payment_type === 'cash' ? 'Наличные' : 'Безналичные',
					store: order.device_name,
				}))

				const filteredByProduct =
					selectedProduct === 'Все товары'
						? transformedData
						: transformedData.filter(item => item.product === selectedProduct)

				setSalesData(filteredByProduct)
				console.log('Orders fetched:', filteredByProduct)
				if (filteredByProduct.length === 0) {
					setError('Нет данных за указанный период')
				}
			} catch (error) {
				console.error('Ошибка при загрузке заказов:', error)
				setError('Ошибка при загрузке данных')
				setSalesData([])
			} finally {
				setLoading(false)
			}
		}

		fetchOrders()
	}, [
		currentPage,
		itemsPerPage,
		startDate,
		endDate,
		selectedStore,
		selectedPayment,
		selectedProduct,
		sortState,
	])

	const filteredData = salesData.filter(item =>
		Object.values(item).some(value =>
			value.toString().toLowerCase().includes(searchQuery.toLowerCase())
		)
	)

	const totalPages = Math.ceil(totalCount / itemsPerPage)
	const paginationRange = usePagination(totalPages, currentPage)

	const totalCost = filteredData.reduce((sum, item) => sum + item.cost, 0)
	const totalIssued = filteredData.reduce((sum, item) => sum + item.issued, 0)
	const totalOrdered = filteredData.reduce((sum, item) => sum + item.ordered, 0)

	return (
		<div className='p-4 bg-gray-100 min-h-screen'>
			<StatisticsFilter
				startDate={startDate}
				endDate={endDate}
				setDateRange={setDateRange}
				setSelectedStore={setSelectedStore}
				setSelectedPayment={setSelectedPayment}
				setSelectedProduct={setSelectedProduct}
			/>
			<div className='bg-white p-4 rounded-lg shadow-md'>
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
						className='border-b border-gray-400 py-1 text-gray-700 focus:outline-none focus:border-blue-500 w-full max-w-44'
					/>
				</div>
				{loading ? (
					<div className='flex justify-center items-center h-[400px]'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
						<p className='ml-2'>Загрузка...</p>
					</div>
				) : error && filteredData.length === 0 ? (
					<p className='text-center text-red-500 p-4'>{error}</p>
				) : (
					<StatisticsTable
						paginatedData={filteredData}
						totalCost={totalCost}
						totalIssued={totalIssued}
						totalOrdered={totalOrdered}
						data={salesData}
						sortState={sortState}
						setSortState={setSortState}
					/>
				)}
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
		</div>
	)
}

export default SalesPage
