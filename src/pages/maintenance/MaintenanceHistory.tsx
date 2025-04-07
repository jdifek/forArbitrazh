import { useEffect, useState } from 'react'
import { MaintenanceRecord } from '../../types'
import { MaintenanceService } from '../../api/PosDevices/PosDevicesService'

const MaintenanceHistory = () => {
	const [maintenanceHistory, setMaintenanceHistory] = useState<
		MaintenanceRecord[]
	>([])
	const [statusFilter, setStatusFilter] = useState<'scheduled' | 'completed'>(
		'scheduled'
	)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchMaintenanceHistory = async () => {
			setLoading(true)
			setError(null)
			try {
				const params = { status: statusFilter, limit: 9999 }
				const res = await MaintenanceService.getMaintenanceHistory(params)
				setMaintenanceHistory(res.data.results)
				console.log(res.data.results)
			} catch (error) {
				console.error('Ошибка при загрузке истории обслуживания:', error)
				setError('Не удалось загрузить данные')
				setMaintenanceHistory([])
			} finally {
				setLoading(false)
			}
		}

		fetchMaintenanceHistory()
	}, [statusFilter])

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	}

	const calculateDaysLeft = (deadline: string) => {
		const today = new Date()
		const deadlineDate = new Date(deadline)
		const diffInMs = deadlineDate.getTime() - today.getTime()
		const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
		return daysLeft >= 0 ? `${daysLeft} дн.` : `${daysLeft} дн.`
	}

	return (
		<div className='p-4 lg:p-8'>
			<div className='bg-white shadow-lg rounded-lg w-full p-6 mx-auto sm:max-w-[640px] md:max-w-full lg:max-w-[700px] max-w-1lg_sm max-w-1_5lg_sm max-w-2lg_sm max-w-2_5lg_sm max-w-3lg_sm max-w-3_5lg_sm max-w-4lg_sm xl:max-w-full 2xl:max-w-full'>
				<div className='mb-5 flex max-sm:flex-wrap max-sm:gap-3 justify-between items-center'>
					<h3 className='text-lg leading-6 font-medium text-gray-900'>
						История обслуживания
					</h3>
					<div className='flex space-x-4'>
						<button
							onClick={() =>
								setStatusFilter(prev =>
									prev === 'scheduled' ? 'completed' : 'scheduled'
								)
							}
							className='px-4 py-2 rounded bg-blue-500 text-white text-sm sm:text-base'
						>
							{statusFilter === 'scheduled' ? 'Заплановані' : 'Виконані'}
						</button>
					</div>
				</div>
				<div className='overflow-x-auto'>
					{loading ? (
						<div className='flex justify-center items-center h-[400px]'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
							<p className='ml-2'>Загрузка...</p>
						</div>
					) : error ? (
						<p className='text-center text-red-500'>{error}</p>
					) : (
						<table className='w-full border-collapse divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Создано
									</th>
									<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Дедлайн
									</th>
									<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Запланировано на
									</th>
									{(statusFilter === 'completed' && (
										<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Выполнено
										</th>
									)) ||
										(statusFilter === 'scheduled' && (
											<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Остаток дней
											</th>
										))}
									<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Аппарат
									</th>
									<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Тип обслуживания
									</th>
									<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Техник
									</th>
									<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Статус
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{maintenanceHistory.map(record => (
									<tr key={record.id}>
										<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatDate(record.created_at)}
										</td>
										<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatDate(record.deadline)}
										</td>
										<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
											{record.planned_for
												? formatDate(record.planned_for)
												: '-'}
										</td>
										{(statusFilter === 'completed' && (
											<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
												{record.completed_at
													? formatDate(record.completed_at)
													: '-'}
											</td>
										)) ||
											(statusFilter === 'scheduled' && (
												<td
													className={`px-3 py-4 whitespace-nowrap text-sm ${
														calculateDaysLeft(record.deadline).includes('-')
															? 'text-red-500 font-semibold'
															: 'text-gray-500'
													}`}
												>
													{calculateDaysLeft(record.deadline)}
												</td>
											))}
										<td className='px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
											{record.device.name}
										</td>
										<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
											{record.type}
										</td>
										<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
											{record.assigned_to.full_name}
										</td>
										<td className='px-3 py-4 whitespace-nowrap'>
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													record.status === 'completed'
														? 'bg-green-100 text-green-800'
														: 'bg-yellow-100 text-yellow-800'
												}`}
											>
												{record.status === 'completed'
													? 'Выполнено'
													: 'В ожидании'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	)
}

export default MaintenanceHistory
