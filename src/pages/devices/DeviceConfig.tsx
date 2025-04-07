import { useEffect, useState } from 'react'
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

const BILL_ACCEPTOR_MODEL_OPTIONS = {
	nv9usb: 'NV9USB',
}

const COINL_ACCEPTOR_MODEL_OPTIONS = {
	'microcoin sp': 'MICROCOIN SP',
}

const fieldLabel: Record<string, string> = {
	vibration_sensor_sensitivity: 'Чувствительность датчика вибрации',
}

export const DeviceConfig = () => {
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isDisabled, setIsDisabled] = useState<boolean>(true)
	const [billAcceptorModel, setBillAcceptorModel] = useState<string>('')
	const [coinlAcceptorModel, setCoinAcceptorModel] = useState<string>('')
	const [editedValues, setEditedValues] = useState<
		Record<string, string | number>
	>({})
	const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
	const { selectedDevice, loading, error } = useDevice()
	const { userRole } = useAuth()
	const { canEdit } = usePermissions()

	useEffect(() => {
		if (selectedDevice) {
			setBillAcceptorModel(
				BILL_ACCEPTOR_MODEL_OPTIONS[
					selectedDevice.bill_acceptor_model?.toLowerCase()
				] || 'NV9USB'
			)
			setCoinAcceptorModel(
				COINL_ACCEPTOR_MODEL_OPTIONS[
					selectedDevice.coin_acceptor_model?.toLowerCase()
				] || 'MICROCOIN SP'
			)

			setEditedValues({
				vibration_sensor_sensitivity:
					selectedDevice.vibration_sensor_sensitivity ?? '',
			})
		}
	}, [selectedDevice])

	const checkForChanges = () => {
		const newBillModelKey = Object.keys(BILL_ACCEPTOR_MODEL_OPTIONS).find(
			key => BILL_ACCEPTOR_MODEL_OPTIONS[key] === billAcceptorModel
		)
		const newCoinModelKey = Object.keys(COINL_ACCEPTOR_MODEL_OPTIONS).find(
			key => COINL_ACCEPTOR_MODEL_OPTIONS[key] === coinlAcceptorModel
		)

		const hasBillModelChanged =
			newBillModelKey !== selectedDevice?.bill_acceptor_model
		const hasCoinModelChanged =
			newCoinModelKey !== selectedDevice?.coin_acceptor_model
		const hasVibrationChanged =
			String(editedValues.vibration_sensor_sensitivity) !==
			String(selectedDevice?.vibration_sensor_sensitivity)

		return hasBillModelChanged || hasCoinModelChanged || hasVibrationChanged
	}

	useEffect(() => {
		setIsDisabled(!checkForChanges())
	}, [billAcceptorModel, coinlAcceptorModel, editedValues])

	if (loading) return <p>Загрузка устройства...</p>
	if (error) return <p className='text-red-500'>{error}</p>
	if (!selectedDevice) return <p>Устройство не найдено</p>

	const handleBillAcceptorModelChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		setBillAcceptorModel(e.target.value)
		setIsDisabled(false)
	}

	const handleCoinAcceptorModelChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		setCoinAcceptorModel(e.target.value)
		setIsDisabled(false)
	}

	const handleChange = (key: string, value: string | number) => {
		setEditedValues(prev => ({ ...prev, [key]: value }))
		setIsDisabled(false)
	}

	const handleSave = async () => {
		const newBillModelKey = Object.keys(BILL_ACCEPTOR_MODEL_OPTIONS).find(
			key => BILL_ACCEPTOR_MODEL_OPTIONS[key] === billAcceptorModel
		)
		const newCoinModelKey = Object.keys(COINL_ACCEPTOR_MODEL_OPTIONS).find(
			key => COINL_ACCEPTOR_MODEL_OPTIONS[key] === coinlAcceptorModel
		)

		const updatedValues: Record<string, any> = {}

		if (
			String(editedValues.vibration_sensor_sensitivity) !==
			String(selectedDevice.vibration_sensor_sensitivity)
		) {
			updatedValues.vibration_sensor_sensitivity =
				editedValues.vibration_sensor_sensitivity
		}

		if (
			newBillModelKey &&
			newBillModelKey !== selectedDevice.bill_acceptor_model
		) {
			updatedValues.bill_acceptor_model = newBillModelKey
		}
		if (
			newCoinModelKey &&
			newCoinModelKey !== selectedDevice.coin_acceptor_model
		) {
			updatedValues.coin_acceptor_model = newCoinModelKey
		}

		if (Object.keys(updatedValues).length === 0) {
			console.log('Нет изменений для сохранения')
			setIsDisabled(true)
			return
		}
		if (!canEdit) {
			console.log('У вас нет прав для сохранения изменений')
			return
		}

		try {
			setIsSaving(true)
			if (userRole === 'technician') {
				await PosDevicesService.updateTechnicianDevice(
					selectedDevice.id,
					updatedValues
				)
			} else {
				await PosDevicesService.updateDevice(selectedDevice.id, updatedValues)
			}
		} catch (error) {
			console.error('Ошибка при обновлении устройства:', error)
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
						<div className='bg-white rounded-lg shadow p-6 max-w-3xl mx-auto'>
							<div className='space-y-6'>
								<div className='flex gap-5 items-center'>
									<label className='block text-sm font-medium text-gray-700 w-2/3'>
										Модель купюроприемника
									</label>
									<select
										className='block w-full rounded-md border-gray-300 shadow-sm'
										value={billAcceptorModel}
										onChange={handleBillAcceptorModelChange}
										disabled={!canEdit}
									>
										{Object.values(BILL_ACCEPTOR_MODEL_OPTIONS).map(model => (
											<option key={model} value={model}>
												{model}
											</option>
										))}
									</select>
								</div>

								<div className='flex gap-5 items-center'>
									<label className='block text-sm font-medium text-gray-700 w-2/3'>
										Модель монетоприемника
									</label>
									<select
										className='block w-full rounded-md border-gray-300 shadow-sm'
										value={coinlAcceptorModel}
										onChange={handleCoinAcceptorModelChange}
										disabled={!canEdit}
									>
										{Object.values(COINL_ACCEPTOR_MODEL_OPTIONS).map(model => (
											<option key={model} value={model}>
												{model}
											</option>
										))}
									</select>
								</div>

								{/* Поле для чувствительности датчика вибрации */}
								<div className='flex items-center gap-5'>
									<label className='text-sm font-medium text-gray-700 w-2/3'>
										{fieldLabel.vibration_sensor_sensitivity}
									</label>
									<input
										type='number'
										className='block w-full rounded-md border-gray-300 shadow-sm'
										value={editedValues.vibration_sensor_sensitivity ?? ''}
										onChange={e =>
											handleChange(
												'vibration_sensor_sensitivity',
												e.target.value
											)
										}
										disabled={!canEdit}
									/>
								</div>
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
