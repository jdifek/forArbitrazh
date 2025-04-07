import { ru } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import PosDevicesService from '../../api/PosDevices/PosDevicesService'
import ProductsService from '../../api/Products/ProductsService'

interface StatisticsFilterProps {
	startDate: Date | null
	endDate: Date | null
	setDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>
	setSelectedStore: (store: string) => void
	setSelectedPayment: (payment: string) => void
	setSelectedProduct: (product: string) => void
}

const StatisticsFilter = ({
	startDate,
	endDate,
	setDateRange,
	setSelectedStore,
	setSelectedPayment,
	setSelectedProduct,
}: StatisticsFilterProps) => {
	const [products, setProducts] = useState<{ id: number; name: string }[]>([])
	const [deviceNames, setDeviceNames] = useState<
		{ id: number; name: string }[]
	>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [selectedStore, setLocalStore] = useState<string>('Все торговые точки')
	const [selectedPayment, setLocalPayment] = useState<string>('Все типы')
	const [selectedProduct, setLocalProduct] = useState<string>('Все товары')

	const fetchProducts = async () => {
		setLoading(true)
		try {
			const response = await ProductsService.getProducts()
			setProducts(response.data?.results || [])
		} catch (error) {
			console.error('Ошибка при загрузке продуктов', error)
			setProducts([])
		} finally {
			setLoading(false)
		}
	}

	const fetchDeviceNames = async () => {
		setLoading(true)
		try {
			const response = await PosDevicesService.getDevicesNames()
			setDeviceNames(response.data?.results || [])
		} catch (error) {
			console.error('Ошибка при загрузке getDevicesNames', error)
			setDeviceNames([])
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts()
		fetchDeviceNames()
	}, [])

	const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		setLocalStore(value)
		setSelectedStore(value)
	}

	const handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		setLocalPayment(value)
		setSelectedPayment(value)
	}

	const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		setLocalProduct(value)
		setSelectedProduct(value)
	}

	return (
		<div className='bg-white p-5 pb-7 rounded-lg shadow-md mb-4'>
			<h2 className='font-semibold mb-2'>Фильтр</h2>
			<div className='border-b border-gray-300 pb-2 mb-10 w-full max-w-52'>
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
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-[14px]'>
				<select
					className='border p-2 rounded w-full'
					value={selectedStore}
					onChange={handleStoreChange}
				>
					<option value='Все торговые точки'>Все торговые точки</option>
					{loading ? (
						<option disabled>Загрузка...</option>
					) : (
						deviceNames.map(device => (
							<option key={device.id} value={device.id.toString()}>
								{device.name}
							</option>
						))
					)}
				</select>
				<select
					className='border p-2 rounded w-full'
					value={selectedPayment}
					onChange={handlePaymentChange}
				>
					<option value='Все типы'>Все типы</option>
					<option value='Наличные'>Наличные</option>
					<option value='Безналичные'>Безналичные</option>
				</select>
				<select
					className='border p-2 rounded w-full'
					value={selectedProduct}
					onChange={handleProductChange}
				>
					<option value='Все товары'>Все товары</option>
					{loading ? (
						<option disabled>Загрузка...</option>
					) : (
						products.map(product => (
							<option key={product.id} value={product.name}>
								{product.name}
							</option>
						))
					)}
				</select>
			</div>
		</div>
	)
}

export default StatisticsFilter
