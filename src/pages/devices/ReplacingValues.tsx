import { useState, useEffect } from 'react'
import PosDevicesService from '../../api/PosDevices/PosDevicesService'
import { DeviceSidebar } from '../../components/Device/DeviceSidebar'
import { DeviceNavigate } from '../../components/Device/Navigate'
import { SelectDevice } from '../../components/Device/SelectDevice'
import { ButtonSave } from '../../components/ui/Button'
import { useDevice } from '../../helpers/context/DeviceContext'
import { IoSettingsSharp } from 'react-icons/io5'
import useSidebar from '../../helpers/hooks/useSidebar'
import usePermissions from '../../helpers/hooks/usePermissions'
import { useAuth } from '../../helpers/context/AuthContext'

const fieldLabels: Record<string, string> = {
	water_inlet_counter: 'Счетчик воды на входе',
	total_coins_quantity: 'Количество монет за все время',
	total_coins_earned: 'Сумма монет за все время',
	total_bills_quantity: 'Количество купюр за все время',
	total_bills_earned: 'Сумма купюр за все время',
	total_water_sold: 'Всего продуктов продано',
	electricity_counter: 'Счетчик Электроэнергии',
}

// Единицы измерения для каждого поля
const units: Record<string, string> = {
	water_inlet_counter: 'л',
	total_coins_quantity: 'шт',
	total_coins_earned: '₴',
	total_bills_quantity: 'шт',
	total_bills_earned: '₴',
	total_water_sold: 'л',
	electricity_counter: 'kW h',
}

export const ReplacingValues = () => {
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isDisabled, setIsDisabled] = useState<boolean>(true)
	const [editedValues, setEditedValues] = useState<
		Record<string, string | number>
	>({})
	const { selectedDevice, loading, error } = useDevice()
	const { userRole } = useAuth()
	const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
	const { canEdit } = usePermissions()

	const checkForChanges = () => {
		if (!selectedDevice) return false
		return Object.keys(fieldLabels).some(key => {
			const currentValue = editedValues[key] ?? ''
			const originalValue = selectedDevice[key] ?? ''
			return String(currentValue) !== String(originalValue)
		})
	}

	useEffect(() => {
		setIsDisabled(!checkForChanges())
	}, [editedValues, selectedDevice])

	useEffect(() => {
		if (selectedDevice) {
			const initialValues: Record<string, string | number> = {}
			Object.keys(fieldLabels).forEach(key => {
				initialValues[key] = selectedDevice[key] ?? ''
			})
			setEditedValues(initialValues)
			setIsDisabled(true) // Устанавливаем неактивность при загрузке данных
		}
	}, [selectedDevice])

	if (loading) return <div className='p-4 lg:p-8'>Загрузка устройства...</div>
	if (error) return <div className='p-4 lg:p-8 text-red-500'>{error}</div>
	if (!selectedDevice)
		return <div className='p-4 lg:p-8'>Устройство не найдено</div>

	const handleChange = (key: string, value: string | number) => {
		if (canEdit) {
			setEditedValues(prev => ({ ...prev, [key]: value }))
			// Убрано setIsDisabled(false), теперь только useEffect управляет состоянием
		}
	}

	const handleSave = async () => {
		if (!canEdit) {
			console.log('У вас нет прав для сохранения изменений')
			return
		}
		try {
			setIsSaving(true)
			if (userRole === 'technician') {
				await PosDevicesService.updateTechnicianDevice(
					selectedDevice.id,
					editedValues
				)
			} else {
				await PosDevicesService.updateDevice(selectedDevice.id, editedValues)
			}
		} catch (error) {
			console.error('Ошибка при сохранении:', error)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className='p-4 lg:p-8'>
			<SelectDevice />

			<div className='flex gap-3 flex-nowrap w-full lg:max-w-[748px] xl:max-w-[960px] 2xl:max-w-full'>
				<div className='w-full bg-white rounded-lg shadow p-5 flex flex-col flex-1'>
					<DeviceNavigate />

					<div className='p-4 lg:p-8'>
						<div className='bg-white rounded-lg shadow p-6'>
							<div className='space-y-6'>
								{Object.entries(fieldLabels)
									.filter(
										([key, label]) =>
											label.length > 0 &&
											selectedDevice[key] !== undefined &&
											selectedDevice[key] !== null
									)
									.map(([key, label]) => (
										<div key={key}>
											<label className='block text-sm font-medium text-gray-700'>
												{label}
											</label>
											<div className='mt-1 flex rounded-md shadow-sm'>
												{units[key] === 'шт' ? (
													<input
														type='number'
														step={1}
														pattern='\d*'
														onKeyDown={e => {
															if (
																e.key === 'e' ||
																e.key === '.' ||
																e.key === ','
															) {
																e.preventDefault()
															}
														}}
														className='block w-full rounded-md border-gray-300 shadow-sm'
														value={
															editedValues[key] ?? selectedDevice[key] ?? ''
														}
														onChange={e => handleChange(key, e.target.value)}
														disabled={!canEdit}
													/>
												) : (
													<input
														type='number'
														className='block w-full rounded-md border-gray-300 shadow-sm'
														value={
															editedValues[key] ?? selectedDevice[key] ?? ''
														}
														onChange={e => handleChange(key, e.target.value)}
														disabled={!canEdit}
													/>
												)}

												<span className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500'>
													{units[key] || ''}
												</span>
											</div>
										</div>
									))}
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
