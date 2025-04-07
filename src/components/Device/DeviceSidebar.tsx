import { useState } from 'react'
import {
	IoCheckmark,
	IoClose,
	IoKeyOutline,
	IoPencil,
	IoReloadOutline,
} from 'react-icons/io5'
import { motion } from 'framer-motion'
import PosDevicesService from '../../api/PosDevices/PosDevicesService'
import { useDevice } from '../../helpers/context/DeviceContext'
import { useAuth } from '../../helpers/context/AuthContext'

interface DeviceSidebarProps {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
}

export const DeviceSidebar = ({ isOpen, setIsOpen }: DeviceSidebarProps) => {
	const { selectedDevice, loading } = useDevice()
	const { userRole } = useAuth()
	const [isEditingAlerts, setIsEditingAlerts] = useState(false)
	const [isEditingAccess, setIsEditingAccess] = useState(false)
	const [alertedUsers, setAlertedUsers] = useState(
		selectedDevice?.alerted_users || []
	)
	const [trustedUsers, setTrustedUsers] = useState(
		selectedDevice?.trusted_users || []
	)
	const [isSaving, setIsSaving] = useState(false)
	if (!selectedDevice) return <p>Устройство не найдено</p>

	const handleRemoveUser = (type: 'alerted' | 'trusted', userId: number) => {
		if (type === 'alerted') {
			setAlertedUsers(prev => prev.filter(user => user.id !== userId))
		} else {
			setTrustedUsers(prev => prev.filter(user => user.id !== userId))
		}
	}

	const handleSave = async () => {
		setIsSaving(true)
		try {
			const updatedData = {
				alerted_users: alertedUsers.map(user => ({ id: user.id })),
				trusted_users: trustedUsers.map(user => ({ id: user.id })),
			}

			// Выбор метода в зависимости от роли
			if (userRole === 'driver') {
				await PosDevicesService.updateDriverDevice(
					selectedDevice.id,
					updatedData
				)
			} else if (userRole === 'technician') {
				await PosDevicesService.updateTechnicianDevice(
					selectedDevice.id,
					updatedData
				)
			} else {
				await PosDevicesService.updateDevice(selectedDevice.id, updatedData)
			}

			console.log('Данные успешно обновлены!')
		} catch (error) {
			console.error('Ошибка при обновлении данных устройства:', error)
		} finally {
			setIsSaving(false)
		}
	}

	if (loading) {
		return (
			<div className='flex justify-center items-center py-6'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
			</div>
		)
	}

	return (
		<>
			{/* Оверлей для мобильной версии*/}
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.5 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 bg-black z-40 xl:hidden'
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Сайдбар */}
			<div
				className={`bg-white rounded-lg shadow p-6 w-[240px] shrink-0 xl:static xl:block ${
					isOpen ? 'fixed top-0 right-0 h-full z-50' : 'hidden'
				}`}
			>
				{/* Кнопка "Закрыть" для моб ширине */}
				{isOpen && (
					<button
						className='xl:hidden mb-4 text-red-500 hover:text-red-600 flex items-center gap-2'
						onClick={() => setIsOpen(false)}
					>
						<IoClose size={24} />
						Закрыть
					</button>
				)}

				<h3 className='text-lg font-semibold text-center mb-10'>
					{selectedDevice?.name}
				</h3>

				<button
					className='mb-3 text-white bg-blue-500 rounded-lg shadow-md p-2 flex items-center gap-2 w-full'
					disabled={isSaving}
				>
					<IoReloadOutline size={20} />
					Перезагрузка аппарата
				</button>
				<button
					className='mb-10 text-white bg-blue-500 rounded-lg shadow-md p-2 flex items-center gap-2 w-full'
					disabled={isSaving}
				>
					<IoKeyOutline size={20} />
					Сервисный режим
				</button>

				{/* SMS оповещения */}
				<div className='mb-10'>
					<div className='flex justify-between items-center'>
						<span className='font-bold'>Номера SMS оповещений:</span>
						{isEditingAlerts ? (
							<div className='flex gap-2'>
								<button
									onClick={handleSave}
									disabled={isSaving}
									className='text-green-600'
								>
									<IoCheckmark size={18} />
								</button>
								<button
									onClick={() => setIsEditingAlerts(false)}
									className='text-red-600'
								>
									<IoClose size={18} />
								</button>
							</div>
						) : (
							<button
								onClick={() => setIsEditingAlerts(true)}
								className='text-gray-500 hover:text-black'
							>
								<IoPencil className='text-blue-500' size={18} />
							</button>
						)}
					</div>
					{isEditingAlerts ? (
						<ul className='mt-2'>
							{alertedUsers.map(user => (
								<li key={user.id} className='flex justify-between items-center'>
									<span>{user.full_name}</span>
									<button
										onClick={() => handleRemoveUser('alerted', user.id)}
										className='text-red-500'
									>
										<IoClose size={14} />
									</button>
								</li>
							))}
						</ul>
					) : (
						alertedUsers.map(user => (
							<p key={user.id} className='text-gray-800'>
								{user.full_name}
							</p>
						))
					)}
				</div>

				{/* Доступ к аппарату */}
				<div>
					<div className='flex justify-between items-center'>
						<span className='font-bold'>
							Пользователи с доступом к аппарату:
						</span>
						{isEditingAccess ? (
							<div className='flex gap-2'>
								<button
									onClick={handleSave}
									disabled={isSaving}
									className='text-green-600'
								>
									<IoCheckmark size={18} />
								</button>
								<button
									onClick={() => setIsEditingAccess(false)}
									className='text-red-600'
								>
									<IoClose size={18} />
								</button>
							</div>
						) : (
							<button
								onClick={() => setIsEditingAccess(true)}
								className='text-gray-500 hover:text-black'
							>
								<IoPencil className='text-blue-500' size={18} />
							</button>
						)}
					</div>
					{isEditingAccess ? (
						<ul className='mt-2'>
							{trustedUsers.map(user => (
								<li key={user.id} className='flex justify-between items-center'>
									<span>{user.full_name}</span>
									<button
										onClick={() => handleRemoveUser('trusted', user.id)}
										className='text-red-500'
									>
										<IoClose size={14} />
									</button>
								</li>
							))}
						</ul>
					) : (
						trustedUsers.map(user => (
							<p key={user.id} className='text-gray-800'>
								{user.full_name}
							</p>
						))
					)}
				</div>
			</div>
		</>
	)
}
