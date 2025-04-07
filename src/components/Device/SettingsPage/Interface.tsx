import { useEffect, useState } from 'react'
import PosDevicesService from '../../../api/PosDevices/PosDevicesService'
import {
	IPosDeviceDetails,
	IPosTechnicianDeviceDetails,
} from '../../../api/PosDevices/PosDevicesTypes'
import { ButtonSave } from '../../ui/Button'
import { useAuth } from '../../../helpers/context/AuthContext'
import usePermissions from '../../../helpers/hooks/usePermissions'

interface IInterfaceProps {
	selectedDevice: IPosDeviceDetails | IPosTechnicianDeviceDetails
	loading: boolean
}

const LANGUAGE_OPTIONS = {
	ukrainian: 'Українська',
	russian: 'Русский',
	english: 'English',
}

export const Interface = ({ selectedDevice, loading }: IInterfaceProps) => {
	const { userRole } = useAuth()
	const [interfaceLanguage, setInterfaceLanguage] = useState<string>('')
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isDisabled, setIsDisabled] = useState<boolean>(true)
	const { canEdit } = usePermissions()

	useEffect(() => {
		const language = selectedDevice.interface_language.toLowerCase()
		setInterfaceLanguage(LANGUAGE_OPTIONS[language] || 'Українська')
	}, [selectedDevice])

	useEffect(() => {
		const currentLanguage = selectedDevice.interface_language.toLowerCase()
		const selectedLanguage = Object.keys(LANGUAGE_OPTIONS).find(
			key => LANGUAGE_OPTIONS[key] === interfaceLanguage
		)
		setIsDisabled(currentLanguage === selectedLanguage)
	}, [interfaceLanguage])

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (canEdit) {
			setInterfaceLanguage(e.target.value)
			setIsDisabled(false)
		}
	}

	const handleSave = async () => {
		const newLanguageKey = Object.keys(LANGUAGE_OPTIONS).find(
			key => LANGUAGE_OPTIONS[key] === interfaceLanguage
		)
		if (!canEdit) {
			console.log('У вас нет прав для сохранения изменений')
			return
		}

		if (newLanguageKey) {
			try {
				setIsSaving(true)
				if (userRole === 'technician') {
					await PosDevicesService.updateTechnicianDevice(selectedDevice.id, {
						interface_language: newLanguageKey,
					})
				} else {
					await PosDevicesService.updateDevice(selectedDevice.id, {
						interface_language: newLanguageKey,
					})
				}
			} catch (error) {
				console.error('Ошибка при обновлении языка интерфейса:', error)
			} finally {
				setIsSaving(false)
			}
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
			<h2 className='text-xl font-semibold mb-6'>Настройки интерфейса</h2>
			<div className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Язык интерфейса
					</label>
					<select
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
						value={interfaceLanguage}
						onChange={handleLanguageChange}
						disabled={!canEdit}
					>
						{Object.values(LANGUAGE_OPTIONS).map(lang => (
							<option key={lang} value={lang}>
								{lang}
							</option>
						))}
					</select>
				</div>
				<ButtonSave
					onClick={handleSave}
					disabled={!canEdit || isDisabled}
					isSaving={isSaving}
				/>
			</div>
		</div>
	)
}
