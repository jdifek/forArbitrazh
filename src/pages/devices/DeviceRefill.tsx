import { useState, useEffect } from 'react'
import { useDevice } from '../../helpers/context/DeviceContext'
import { useAuth } from '../../helpers/context/AuthContext'
import { SelectDevice } from '../../components/Device/SelectDevice'
import { DeviceNavigate } from '../../components/Device/Navigate'
import PosDevicesService from '../../api/PosDevices/PosDevicesService'
import { ButtonSave } from '../../components/ui/Button'
import { DeviceSidebar } from '../../components/Device/DeviceSidebar'
import { IoSettingsSharp } from 'react-icons/io5'
import useSidebar from '../../helpers/hooks/useSidebar'
import usePermissions from '../../helpers/hooks/usePermissions'

const fieldLabels: Record<string, string> = {
	water_sold_since_last_refill: 'Продано',
	water_amount_after_last_refill: 'Заправка',
}

const DeviceRefill = () => {
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isDisabled, setIsDisabled] = useState<boolean>(true)
	const [editedValues, setEditedValues] = useState<Record<string, number>>({})
	const [pendingServiceMode, setPendingServiceMode] = useState<boolean>(false)
	const { selectedDevice, loading, error } = useDevice()
	const { userRole } = useAuth()
	const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
	const { canEdit } = usePermissions()

	console.log('selected driver device:', selectedDevice)
	console.log('selected ID driver device:', selectedDevice?.id)

	const checkForChanges = () => {
		if (!selectedDevice) return false
		const hasValuesChanged = Object.keys(fieldLabels).some(key => {
			const currentValue = editedValues[key]
			const originalValue = selectedDevice[key]
			return currentValue !== undefined && currentValue !== originalValue
		})
		const hasServiceModeChanged =
			pendingServiceMode !== selectedDevice.service_mode
		return hasValuesChanged || hasServiceModeChanged
	}

	useEffect(() => {
		setIsDisabled(!checkForChanges())
	}, [editedValues, pendingServiceMode, selectedDevice])

	useEffect(() => {
		if (selectedDevice) {
			const initialValues: Record<string, number> = {}
			Object.keys(fieldLabels).forEach(key => {
				initialValues[key] = selectedDevice[key] ?? 0
			})
			setEditedValues(initialValues)
			setPendingServiceMode(selectedDevice.service_mode ?? false)
		}
	}, [selectedDevice])

	const handleChange = (key: string, value: number) => {
		if (canEdit) {
			setEditedValues(prev => ({ ...prev, [key]: value }))
			setIsDisabled(false)
		}
	}

	const handleToggleServiceMode = () => {
		if (canEdit) {
			setPendingServiceMode(prev => !prev)
			setIsDisabled(false)
		}
	}

	const handleSave = async () => {
		if (!canEdit) {
			console.log('У вас нет прав для сохранения изменений')
			return
		}
		try {
			setIsSaving(true)
			const updateData = {
				...editedValues,
				service_mode: pendingServiceMode,
			}
			if (userRole === 'driver') {
				await PosDevicesService.updateDriverDevice(
					selectedDevice.id,
					updateData
				)
			} else {
				await PosDevicesService.updateDevice(selectedDevice.id, updateData)
			}
		} catch (error) {
			console.error('Ошибка при сохранении:', error)
		} finally {
			setIsSaving(false)
		}
	}

	if (loading) return <div className="p-4 lg:p-8">Загрузка устройства...</div>
	if (error) return <div className="p-4 lg:p-8 text-red-500">{error}</div>
	if (!selectedDevice) return <div className="p-4 lg:p-8">Устройство не найдено</div>

	return (
		<div className='p-4 lg:p-8'>
			<SelectDevice />

			<div className='flex gap-3 flex-nowrap w-full lg:max-w-[748px] xl:max-w-[960px] 2xl:max-w-full'>
				<div className='w-full bg-white rounded-lg shadow p-5 flex flex-col flex-1'>
					<DeviceNavigate />

					<div className='p-4 lg:p-8'>
						<div className='bg-white rounded-lg shadow p-6'>
							<div className='space-y-6'>
								{Object.entries(fieldLabels).map(([key, label]) => (
									<div key={key}>
										<label className='block text-sm font-medium text-gray-700'>
											{label}
										</label>
										<div className='mt-1 flex rounded-md shadow-sm'>
											<input
												type='number'
												className='block w-full rounded-md border-gray-300 shadow-sm'
												value={editedValues[key] ?? selectedDevice[key] ?? 0}
												onChange={e =>
													handleChange(key, parseInt(e.target.value) || 0)
												}
												disabled={isSaving || !canEdit}
											/>
											<span className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500'>
												л
											</span>
										</div>
									</div>
								))}
								<div className='flex items-center'>
									<input
										type='checkbox'
										id='serviceMode'
										className='mr-2'
										checked={pendingServiceMode}
										onChange={handleToggleServiceMode}
										disabled={isSaving || !canEdit}
									/>
									<label htmlFor='serviceMode'>Сервисный режим</label>
								</div>
								{/* Кнопка сохранения */}
								<ButtonSave
									onClick={handleSave}
									disabled={!canEdit || isDisabled}
									isSaving={isSaving}
								/>
							</div>
						</div>
					</div>
				</div>

				<button
					className='xl:hidden fixed top-16 right-4 z-50 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg shadow-md'
					onClick={() => setIsSidebarOpen(true)}
				>
					<IoSettingsSharp size={24} />
				</button>
				<DeviceSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
			</div>
		</div>
	)
}

export default DeviceRefill
