import { ru } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CollectionTableSection from '../../components/statistics/CollectionTableSection'
import { CollectionTableData } from '../../types'
import { CashCollectionsService } from '../../api/PosDevices/PosDevicesService'
import { useDevice } from '../../helpers/context/DeviceContext'
import { formatDateToServer } from '../../helpers/function/formatDateToServer'

const Collection = () => {
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
		const endDate = new Date()
		const startDate = new Date()
		startDate.setDate(startDate.getDate() - 30)
		return [startDate, endDate]
	})
	const [startDate, endDate] = dateRange
	const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
	const { devices } = useDevice()

	const [tableData, setTableData] = useState<CollectionTableData[]>([])
	const [totalCount, setTotalCount] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchCollections = async () => {
			setLoading(true)
			setError(null)
			try {
				const dateSt = formatDateToServer(startDate)
				const dateFn = formatDateToServer(endDate)
				const offset = (currentPage - 1) * itemsPerPage

				console.log('Request params:', {
					date_st: dateSt,
					date_fn: dateFn,
					device_id: selectedDeviceId,
					limit: itemsPerPage,
					offset,
				})

				const response = await CashCollectionsService.getCashCollections({
					date_st: dateSt,
					date_fn: dateFn || undefined,
					device_id: selectedDeviceId || undefined,
					limit: itemsPerPage,
					offset,
					type: undefined,
				})

				const mappedData: CollectionTableData[] = response.results.map(
					item => ({
						id: item.id,
						date: new Date(item.collected_at).toLocaleDateString('ru-RU', {
							day: '2-digit',
							month: '2-digit',
						}),
						device: item.device.name,
						type: item.type === 'bills' ? 'Купюры' : 'Монеты',
						collector: item.who_collected.full_name,
						quantity: item.total_quantity,
						amount: Number(item.total_amount),
					})
				)

				setTableData(mappedData)
				setTotalCount(response.count)
				console.log('Fetched collections:', mappedData)
				if (response.results.length === 0) {
					setError('Нет данных за указанный период')
				}
			} catch (err) {
				setError('Ошибка при загрузке данных')
				console.error('Error fetching collections:', err)
				setTableData([])
			} finally {
				setLoading(false)
			}
		}

		fetchCollections()
	}, [startDate, endDate, selectedDeviceId, currentPage, itemsPerPage])

	const filteredData = useMemo(() => {
		return tableData
	}, [tableData])

	return (
		<div className='p-6 space-y-6'>
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
					className='border border-gray-300 rounded-lg w-full max-w-48 py-2 pl-2 pr-4 outline-none text-gray-700 text-sm md:text-base'
				>
					<option value='Усі апарати'>Усі апарати</option>
					{devices.map(device => (
						<option key={device.id} value={device.id}>
							{device.name}
						</option>
					))}
				</select>
			</div>

			<CollectionTableSection
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

export default Collection
