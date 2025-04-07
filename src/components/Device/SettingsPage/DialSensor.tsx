import { useEffect, useState } from 'react'
import PosDevicesService from '../../../api/PosDevices/PosDevicesService'
import {
	IPosDeviceDetails,
	IPosTechnicianDeviceDetails,
} from '../../../api/PosDevices/PosDevicesTypes'
import { ButtonSave } from '../../ui/Button'
import { useAuth } from '../../../helpers/context/AuthContext'
import usePermissions from '../../../helpers/hooks/usePermissions'

interface DialSensorProps {
	isOn: boolean
	setIsOn: React.Dispatch<React.SetStateAction<boolean>>
	selectedDevice: IPosDeviceDetails | IPosTechnicianDeviceDetails
	loading: boolean
}

export const DialSensor = ({
	isOn,
	setIsOn,
	selectedDevice,
	loading,
}: DialSensorProps) => {
	const { userRole } = useAuth()
	const { canEdit } = usePermissions()
	const litersArray = [0.5, 1.0, 1.5, 2.0, 5.0, 6.0, 10.0, 12.0, 19.0]
	const [isDisabled, setIsDisabled] = useState<boolean>(true)

	const formatKey = (liters: number) =>
		`sensor_impulses_${liters.toString().replace('.', '_')}l`

	const [pulseValues, setPulseValues] = useState<{ [key: number]: number }>({})
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [value, setValue] = useState<number>()

	useEffect(() => {
		const initialValues: { [key: number]: number } = {}
		litersArray.forEach(l => {
			const key = formatKey(l) as keyof IPosDeviceDetails
			initialValues[l] = selectedDevice[key] ?? 0
		})
		setPulseValues(initialValues)
	}, [selectedDevice])

	useEffect(() => {
		const hasValuesChanged = litersArray.some(l => {
			const key = formatKey(l) as keyof IPosDeviceDetails
			return pulseValues[l] !== selectedDevice[key]
		})
		setIsDisabled(!hasValuesChanged)
	}, [pulseValues])

	const handleInputChange = (liters: number, value: string) => {
		if (canEdit) {
			const newValue = parseFloat(value) || 0
			setPulseValues(prev => ({ ...prev, [liters]: newValue }))
			setIsDisabled(false)
		}
	}

	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (canEdit) {
			const newValue = parseFloat(e.target.value) || 0
			setValue(newValue)
			setIsDisabled(false)
		}
	}

	const handleSave = async () => {
		if (!canEdit) {
			console.log('У вас нет прав для сохранения изменений')
			return
		}
		setIsSaving(true)
		try {
			const updatedParams: Partial<IPosDeviceDetails> = {}
			litersArray.forEach(l => {
				updatedParams[formatKey(l) as keyof IPosDeviceDetails] = pulseValues[l]
			})

			if (userRole === 'technician') {
				await PosDevicesService.updateTechnicianDevice(
					selectedDevice.id,
					updatedParams
				)
			} else {
				await PosDevicesService.updateDevice(selectedDevice.id, updatedParams)
			}

			console.log('Данные успешно обновлены!')
		} catch (error) {
			console.error('Ошибка при обновлении данных:', error)
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
		<div>
			<h2 className='text-xl font-semibold mb-6'>Настройка датчика набора</h2>
			<div className='space-y-4'>
				<div className='flex gap-3'>
					<label className='relative flex items-center cursor-pointer'>
						<input
							type='checkbox'
							className='sr-only'
							checked={isOn}
							onChange={() => setIsOn(!isOn)}
							disabled={!canEdit}
						/>
						<div
							className={`w-14 h-7 bg-gray-300 rounded-full p-1 transition ${
								isOn ? 'bg-green-500' : ''
							}`}
						>
							<div
								className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
									isOn ? 'translate-x-7' : ''
								}`}
							></div>
						</div>
					</label>
					<p className='text-gray-400 font-semibold'>
						Рассчитать автоматически из:
					</p>
				</div>

				<div className='flex items-center gap-2 mb-2'>
					<label className='block text-sm font-medium text-blue-300 mr-2'>
						1л
					</label>
					<div className='mt-1 flex'>
						<input
							type='number'
							className='block w-full rounded-md border-gray-300 shadow-sm'
							value={value || ''}
							onChange={handleValueChange}
							disabled={!canEdit}
						/>
					</div>
					<p className='text-gray-400 font-semibold text-sm'>импульсов</p>
				</div>

				<ButtonSave onClick={handleSave} disabled={isDisabled} />

				{litersArray.map((el, index) => (
					<div key={index} className='flex items-center gap-2'>
						<label className='block text-sm font-medium text-blue-300 mr-2'>
							{el}л
						</label>
						<div className='mt-1 flex'>
							<input
								type='number'
								className='block w-full rounded-md border-gray-300 shadow-sm'
								value={pulseValues[el] || ''}
								onChange={e => handleInputChange(el, e.target.value)}
								disabled={!canEdit}
							/>
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
	)
}
