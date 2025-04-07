import { useEffect, useState } from 'react'
import { ButtonSave } from '../../ui/Button'
import PosDevicesService from '../../../api/PosDevices/PosDevicesService'
import {
	IPosDeviceDetails,
	IPosTechnicianDeviceDetails,
} from '../../../api/PosDevices/PosDevicesTypes'
import { useAuth } from '../../../helpers/context/AuthContext'
import usePermissions from '../../../helpers/hooks/usePermissions'

interface MachineStateProps {
	selectedDevice: IPosDeviceDetails | IPosTechnicianDeviceDetails
	loading: boolean
}

export const MachineState = ({
	selectedDevice,
	loading,
}: MachineStateProps) => {
	const { userRole } = useAuth()
	const [active, setActive] = useState<boolean>(selectedDevice.is_active)
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isDisabled, setIsDisabled] = useState<boolean>(true)
	const { canEdit } = usePermissions()

	useEffect(() => {
		setActive(selectedDevice.is_active)
	}, [selectedDevice])

	useEffect(() => {
		setIsDisabled(active === selectedDevice.is_active)
	}, [active])

	const handleToggleActive = () => {
		if (canEdit) {
			setActive(prev => !prev)
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
				await PosDevicesService.updateTechnicianDevice(selectedDevice.id, {
					is_active: active,
				})
			} else {
				await PosDevicesService.updateDevice(selectedDevice.id, {
					is_active: active,
				})
			}
		} catch (error) {
			console.error('Ошибка при обновлении состояния аппарата:', error)
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
		<div className='flex max-sm:flex-wrap max-sm:gap-5 justify-between mb-8'>
			<p className='font-bold'>Состояние автомата</p>
			<div
				className={`flex border-solid w-[15rem] border-2 ${
					active ? 'justify-start' : 'justify-end'
				}`}
			>
				<p
					onClick={handleToggleActive}
					className={`text-white p-2 cursor-pointer ${
						active ? 'bg-green-500' : 'bg-red-500'
					}`}
				>
					{active ? 'Активирован' : 'Деактивирован'}
				</p>
			</div>
			<ButtonSave
				onClick={handleSave}
				disabled={!canEdit || isDisabled}
				isSaving={isSaving}
			/>
		</div>
	)
}
