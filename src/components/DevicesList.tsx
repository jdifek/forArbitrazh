/* временно прописанные роли пользователей */

// import { AlertTriangle, Check, X } from 'lucide-react'
// import { useContext, useState } from 'react'
// import { AuthContext } from '../helpers/context/AuthContext'

// interface Device {
// 	id: number
// 	name: string
// 	address: string
// 	connection: 'ok' | 'error' | 'warning'
// 	sensor: 'ok' | 'error' | 'warning'
// 	system: 'ok' | 'error' | 'warning'
// 	tankVolume: number
// 	soldLiters: number
// 	filledLiters: number
// 	remainingLiters: number
// 	coinsCount?: number
// 	coinsSum?: number
// 	billsCount?: number
// 	billsSum?: number
// 	totalCash?: number
// }

// const devices: Device[] = [
// 	{
// 		id: 1860,
// 		name: '№ 111902 (Пробный "Фуни" до 2025-04-30)',
// 		address: 'вулиця Головна, 1, Київ, Україна, 5...',
// 		connection: 'error',
// 		sensor: 'warning',
// 		system: 'ok',
// 		tankVolume: 1000,
// 		soldLiters: 200,
// 		filledLiters: 300,
// 		remainingLiters: 800,
// 		coinsCount: 50,
// 		coinsSum: 500,
// 		billsCount: 20,
// 		billsSum: 2000,
// 		totalCash: 2500,
// 	},
// 	{
// 		id: 1613,
// 		name: '№ 111737 (Фуни)',
// 		address: 'вул Соборности, 123, W111737',
// 		connection: 'ok',
// 		sensor: 'ok',
// 		system: 'ok',
// 		tankVolume: 34,
// 		soldLiters: 123,
// 		filledLiters: 123,
// 		remainingLiters: 123,
// 		coinsCount: 30,
// 		coinsSum: 300,
// 		billsCount: 10,
// 		billsSum: 1000,
// 		totalCash: 1300,
// 	},
// ]

// const StatusIcon = ({ status }: { status: 'ok' | 'error' | 'warning' }) => {
// 	const statusColors = {
// 		ok: 'text-green-500',
// 		error: 'text-red-500',
// 		warning: 'text-yellow-500',
// 	}

// 	const icons = {
// 		ok: Check,
// 		error: X,
// 		warning: AlertTriangle,
// 	}

// 	const Icon = icons[status]
// 	return <Icon className={statusColors[status]} />
// }

// const DevicesList = () => {
// 	const { user } = useContext(AuthContext)!
// 	const [searchQuery, setSearchQuery] = useState('')

// 	const filteredDevices = devices.filter(device =>
// 		device.id.toString().includes(searchQuery)
// 	)

// 	const columnsByRole: Record<string, string[]> = {
// 		'Супер администратор': [
// 			'id',
// 			'address',
// 			'connection',
// 			'sensor',
// 			'system',
// 			'tankVolume',
// 			'soldLiters',
// 			'filledLiters',
// 			'remainingLiters',
// 		],
// 		Администратор: [
// 			'id',
// 			'address',
// 			'connection',
// 			'sensor',
// 			'system',
// 			'tankVolume',
// 			'soldLiters',
// 			'filledLiters',
// 			'remainingLiters',
// 		],
// 		Оператор: [
// 			'id',
// 			'address',
// 			'connection',
// 			'sensor',
// 			'system',
// 			'tankVolume',
// 			'soldLiters',
// 			'filledLiters',
// 			'remainingLiters',
// 		],
// 		Водитель: ['id', 'address', 'tankVolume', 'filledLiters'],
// 		Техник: ['id', 'address', 'connection', 'sensor', 'system'],
// 		Инкассатор: [
// 			'id',
// 			'address',
// 			'coinsCount',
// 			'coinsSum',
// 			'billsCount',
// 			'billsSum',
// 			'totalCash',
// 		],
// 	}

// 	const columns = columnsByRole[user?.role] || []

// 	const columnTitles: Record<string, string> = {
// 		id: 'ID',
// 		address: 'Адрес',
// 		connection: 'Связь',
// 		sensor: 'Сенсор',
// 		system: 'Система',
// 		tankVolume: 'Объем',
// 		soldLiters: 'Продано',
// 		filledLiters: 'Заправка',
// 		remainingLiters: 'Остаток',
// 		coinsCount: 'Кол-во монет',
// 		coinsSum: 'Сумма монет',
// 		billsCount: 'Кол-во купюр',
// 		billsSum: 'Сумма купюр',
// 		totalCash: 'Общая сумма',
// 	}

// 	// Функция для вычисления итогов
// 	const total = (column: string) => {
// 		return filteredDevices.reduce((sum, device) => {
// 			const value = device[column as keyof Device]
// 			return typeof value === 'number' ? sum + value : sum
// 		}, 0)
// 	}

// 	return (
// 		<div className='p-4 lg:p-8'>
// 			<div className='flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0'>
// 				<h1 className='text-xl lg:text-2xl font-semibold'>Список аппаратов</h1>
// 				<input
// 					type='text'
// 					placeholder='Поиск по ID'
// 					value={searchQuery}
// 					onChange={e => setSearchQuery(e.target.value)}
// 					className='border-b border-gray-400 py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 w-full sm:w-auto'
// 				/>
// 			</div>

// 			<div className='bg-white rounded-lg shadow p-5'>
// 				<div className='overflow-x-auto'>
// 					<table className='min-w-full divide-y divide-gray-200 text-sm'>
// 						<thead className='bg-gray-50'>
// 							<tr>
// 								{columns.map(column => (
// 									<th
// 										key={column}
// 										className='px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider'
// 									>
// 										{columnTitles[column]}
// 									</th>
// 								))}
// 							</tr>
// 						</thead>
// 						<tbody className='bg-white divide-y divide-gray-200'>
// 							{filteredDevices.map(device => (
// 								<tr key={device.id} className='hover:bg-gray-50'>
// 									{columns.map(column => (
// 										<td key={column} className='px-4 py-2'>
// 											{column === 'connection' ||
// 											column === 'sensor' ||
// 											column === 'system' ? (
// 												<StatusIcon
// 													status={
// 														device[column as keyof Device] as
// 															| 'ok'
// 															| 'error'
// 															| 'warning'
// 													}
// 												/>
// 											) : (
// 												device[column as keyof Device]
// 											)}
// 										</td>
// 									))}
// 								</tr>
// 							))}
// 						</tbody>
// 						<tfoot className='bg-gray-100 font-bold'>
// 							<tr>
// 								<td className='px-4 py-2'>Сумма</td>
// 								{columns.slice(1).map(column => (
// 									<td key={column} className='px-4 py-2'>
// 										{[
// 											'tankVolume',
// 											'soldLiters',
// 											'filledLiters',
// 											'remainingLiters',
// 											'coinsCount',
// 											'coinsSum',
// 											'billsCount',
// 											'billsSum',
// 											'totalCash',
// 										].includes(column)
// 											? total(column)
// 											: '—'}
// 									</td>
// 								))}
// 							</tr>
// 						</tfoot>
// 					</table>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default DevicesList

import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IPosDevice } from '../api/PosDevices/PosDevicesTypes'
import { useDevice } from '../helpers/context/DeviceContext'
import { useAuth } from '../helpers/context/AuthContext'

const StatusIcon = ({ status }: { status: 'true' | 'false' }) => {
	const statusColors = {
		true: 'text-green-500',
		false: 'text-red-500',
	}

	const icons = {
		true: Check,
		false: X,
	}

	const normalizedStatus = String(status) === 'true' ? 'true' : 'false'
	const Icon = icons[normalizedStatus] || X

	return <Icon className={statusColors[normalizedStatus] || 'text-red-500'} />
}

// const StatusIcon = ({ status }: { status: 'ok' | 'error' | 'warning' }) => {
// 	const statusColors = {
// 		ok: 'text-green-500',
// 		error: 'text-red-500',
// 		warning: 'text-yellow-500',
// 	}

// 	const icons = {
// 		ok: Check,
// 		error: X,
// 		warning: AlertTriangle,
// 	}

// 	const Icon = icons[status]
// 	return <Icon className={statusColors[status]} />
// }

const DevicesList = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true)
	const { devices, error, loading, fetchDevices, setSelectedDeviceId } =
		useDevice()
	const { userRole } = useAuth()

	const filteredDevices = devices.filter(device =>
		device.id.toString().includes(searchQuery)
	)

	const calculateTotal = (key: keyof IPosDevice) => {
		return filteredDevices
			.reduce((sum, device) => {
				const value = device[key]
				const numericValue = !isNaN(Number(value)) ? Number(value) : 0
				return sum + numericValue
			}, 0)
			.toFixed(2)
	}

	const handleRefreshStats = () => {
		fetchDevices(isActiveFilter)
	}

	const handleToggleActive = () => {
		const newFilter = !isActiveFilter
		setIsActiveFilter(newFilter)
		fetchDevices(newFilter)
	}

	const handleDeviceClick = (id: number) => {
		setSelectedDeviceId(id)
	}

	const getColumns = () => {
		switch (userRole) {
			case 'super_admin':
			case 'admin':
			case 'operator':
				return [
					'ID',
					'Аппарат',
					'Адрес',
					'Связь',
					'Сенсор',
					'Система',
					'Объем резервуара (л)',
					'Продано (л)',
					'Заправка (л)',
					'Остаток (л)',
				]
			case 'technician':
				return ['ID', 'Аппарат', 'Адрес', 'Связь', 'Сенсор', 'Система']
			case 'driver':
				return ['ID', 'Адрес', 'Объем резервуара (л)', 'Заправка (л)']
			default:
				return []
		}
	}

	const getRowData = (device: IPosDevice, column: string) => {
		switch (column) {
			case 'ID':
				return userRole !== 'operator' ? (
					<Link
						to={`/devices/details/${device.id}`}
						onClick={() => handleDeviceClick(device.id)}
						className='text-blue-500 hover:underline'
					>
						{device.id}
					</Link>
				) : (
					device.id
				)
			case 'Аппарат':
				return device.name
			case 'Адрес':
				return device.address
			case 'Связь':
				return <StatusIcon status={device.has_connection} />
			case 'Сенсор':
				return <StatusIcon status={device.sensor_is_ok} />
			case 'Система':
				return <StatusIcon status={device.system_is_ok} />
			case 'Объем резервуара (л)':
				return Number(device.tank_size)
			case 'Продано (л)':
				return Number(device.water_sold_since_last_refill)
			case 'Заправка (л)':
				return Number(device.water_amount_after_last_refill)
			case 'Остаток (л)':
				return device.water_left
			default:
				return ''
		}
	}

	const columns = getColumns()
	const showFooter = userRole !== 'technician'

	return (
		<div className='p-4 lg:p-8'>
			<div className='flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0'>
				<h1 className='text-xl lg:text-2xl font-semibold'>Список аппаратов</h1>
				<div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
					<button
						onClick={handleRefreshStats}
						className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm lg:text-base'
					>
						Обновить статистику
					</button>
					<button
						onClick={handleToggleActive}
						className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm lg:text-base'
					>
						{!isActiveFilter
							? 'Aктивированные аппараты'
							: 'Деактивированные аппараты'}
					</button>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow p-5 w-full mx-auto sm:max-w-[640px] md:max-w-full lg:max-w-[700px] max-w-3lg max-w-2lg xl:max-w-full 2xl:max-w-full'>
				<div className='flex items-center justify-between'>
					<h1 className='text-xl lg:text-2xl font-semibold mb-5'>
						Список аппаратов
					</h1>
					<div className='flex justify-between items-center mb-4'>
						<span className='text-sm'>Поиск:</span>
						<input
							type='text'
							placeholder='По ID'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='border-b border-gray-400 py-1 px-2 text-gray-700 focus:outline-none focus:border-blue-500 w-full sm:w-auto'
						/>
					</div>
				</div>
				{loading ? (
					<div className='flex justify-center items-center py-6'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
					</div>
				) : error ? (
					<p className='text-center text-red-500 p-4'>{error}</p>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200 text-sm'>
							<thead className='bg-gray-50'>
								<tr>
									{columns.map((header, index) => (
										<th
											key={header}
											className={`px-4 py-2 font-medium text-gray-500 tracking-wider ${
												index === 0 ||
												header === 'Аппарат' ||
												header === 'Адрес'
													? 'text-left'
													: 'text-center'
											}`}
										>
											{header}
										</th>
									))}
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredDevices.length > 0 ? (
									filteredDevices.map(device => (
										<tr key={device.id} className='hover:bg-gray-50'>
											{columns.map(column => (
												<td
													key={column}
													className={`px-4 py-2 ${
														column === 'ID' ||
														column === 'Аппарат' ||
														column === 'Адрес'
															? ''
															: 'text-center'
													}`}
												>
													{getRowData(device, column)}
												</td>
											))}
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={columns.length}
											className='text-gray-700 font-semibold text-lg text-center'
										>
											Устройства не найдены
										</td>
									</tr>
								)}
							</tbody>
							{showFooter && (
								<tfoot className='bg-gray-100 font-bold text-center'>
									<tr>
										{columns.map((column, index) => (
											<td key={column} className='px-4 py-2'>
												{index === 0
													? 'Сумма'
													: [
															'Объем резервуара (л)',
															'Продано (л)',
															'Заправка (л)',
															'Остаток (л)',
													  ].includes(column)
													? calculateTotal(
															column === 'Объем резервуара (л)'
																? 'tank_size'
																: column === 'Продано (л)'
																? 'water_sold_since_last_refill'
																: column === 'Заправка (л)'
																? 'water_amount_after_last_refill'
																: 'water_left'
													  )
													: ''}
											</td>
										))}
									</tr>
								</tfoot>
							)}
						</table>
					</div>
				)}
			</div>
		</div>
	)
}

export default DevicesList
