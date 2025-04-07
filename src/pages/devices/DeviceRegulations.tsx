import { useState, useEffect } from 'react'
import PosDevicesService from '../../api/PosDevices/PosDevicesService'
import { DeviceSidebar } from '../../components/Device/DeviceSidebar'
import { DeviceNavigate } from '../../components/Device/Navigate'
import { SelectDevice } from '../../components/Device/SelectDevice'
import { ButtonSave } from '../../components/ui/Button'
import { useDevice } from '../../helpers/context/DeviceContext'
import { useAuth } from '../../helpers/context/AuthContext'
import useSidebar from '../../helpers/hooks/useSidebar'
import { IoSettingsSharp } from 'react-icons/io5'
import usePermissions from '../../helpers/hooks/usePermissions'

const fieldLabels: Record<string, string> = {
	before_replacing_pre_filters: 'До замены предварительных фильтров',
	before_replacing_post_filters: 'До замены постфильтров',
	before_membrane_replacement: 'До замены (промывки) мембран',
	before_antiscalant_replacement: 'До замены антискаланта',
	before_minerals_replacement: 'До замены минералов',
}

const DeviceRegulations = () => {
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isDisabled, setIsDisabled] = useState<boolean>(true)
	const [editedValues, setEditedValues] = useState<Record<string, number>>({})
	const { userRole } = useAuth()
	const { selectedDevice, loading, error } = useDevice()
	const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
	const { canEdit } = usePermissions()

	const checkForChanges = () => {
		if (!selectedDevice) return false
		return Object.keys(fieldLabels).some(key => {
			const currentValue = editedValues[key]
			const originalValue = selectedDevice[key]
			return currentValue !== undefined && currentValue !== originalValue
		})
	}

	useEffect(() => {
		setIsDisabled(!checkForChanges())
	}, [editedValues, selectedDevice])

	useEffect(() => {
		if (selectedDevice) {
			const initialValues: Record<string, number> = {}
			Object.keys(fieldLabels).forEach(key => {
				initialValues[key] = selectedDevice[key] ?? 0
			})
			setEditedValues(initialValues)
		}
	}, [selectedDevice])

	if (loading) return <div className="p-4 lg:p-8">Загрузка устройства...</div>
	if (error) return <div className="p-4 lg:p-8 text-red-500">{error}</div>
	if (!selectedDevice) return <div className="p-4 lg:p-8">Устройство не найдено</div>

	const handleChange = (key: string, value: number) => {
		if (canEdit) {
			setEditedValues(prev => ({ ...prev, [key]: value }))
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
												disabled={!canEdit}
											/>
											<span className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500'>
												л
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

export default DeviceRegulations
