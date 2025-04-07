import React, {
	createContext,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PosDevicesService from '../../api/PosDevices/PosDevicesService'
import {
	IPosDevice,
	IPosDeviceDetails,
	IPosDriverDeviceDetails,
	IPosTechnicianDeviceDetails,
} from '../../api/PosDevices/PosDevicesTypes'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../../api/Users/UsersTypes'

interface DeviceContextType {
	selectedDeviceId: number
	setSelectedDeviceId: (id: number) => void
	handleDeviceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	devices: IPosDevice[]
	setDevices: React.Dispatch<React.SetStateAction<IPosDevice[]>>
	selectedDevice?:
		| IPosDeviceDetails
		| IPosTechnicianDeviceDetails
		| IPosDriverDeviceDetails
	loading: boolean
	error?: string
	fetchDevices: (isActive?: boolean) => void
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const { id } = useParams<{ id: string }>()
	const { isAuthenticated, userRole } = useAuth()

	const [devices, setDevices] = useState<IPosDevice[]>([])
	const [selectedDevice, setSelectedDevice] = useState<
		| IPosDeviceDetails
		| IPosTechnicianDeviceDetails
		| IPosDriverDeviceDetails
		| undefined
	>(undefined)
	const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(
		id ? Number(id) : null
	)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | undefined>(undefined)
	const isInitialMount = useRef(true)

	const deviceRoles = ['operator', 'driver', 'technician', 'collector']

	const fetchDevice = async (deviceId: number) => {
		setLoading(true)
		try {
			if (userRole === 'driver') {
				const device = await PosDevicesService.getDriverDeviceById(deviceId)
				setSelectedDevice(device.data as IPosDriverDeviceDetails)
			} else if (userRole === 'technician') {
				const device = await PosDevicesService.getTechnicianDeviceById(deviceId)
				setSelectedDevice(device.data as IPosTechnicianDeviceDetails)
			} else {
				const device = await PosDevicesService.getDeviceById(deviceId)
				setSelectedDevice(device.data as IPosDeviceDetails)
			}
		} catch (error) {
			console.log('Error fetching device:', error)
			setError('Ошибка при загрузке устройства')
			setSelectedDevice(undefined)
		} finally {
			setLoading(false)
		}
	}

	const fetchDevices = async (isActive?: boolean) => {
		setLoading(true)
		try {
			if (userRole === 'driver') {
				const res = await PosDevicesService.getDriverDevices(
					isActive !== undefined ? { is_active: isActive } : {}
				)
				setDevices(res.data.results)
			} else if (userRole === 'technician') {
				const res = await PosDevicesService.getTechnicianDevices(
					isActive !== undefined ? { is_active: isActive } : {}
				)
				setDevices(res.data.results)
			} else if (userRole !== 'accountant') {
				const res = await PosDevicesService.getDevices(
					isActive !== undefined ? { is_active: isActive } : {}
				)
				setDevices(res.data.results)
			}
		} catch (error) {
			setError('Ошибка при загрузке устройств')
		} finally {
			setLoading(false)
		}
	}

	// Инициализация при монтировании компонента
	useLayoutEffect(() => {
		if (isAuthenticated && userRole) {
			fetchDevices(true)
			if (id) {
				const deviceId = Number(id)
				setSelectedDeviceId(deviceId)
				fetchDevice(deviceId)
			} else if (
				isInitialMount.current &&
				deviceRoles.includes(userRole) &&
				!location.pathname.startsWith('/devices/')
			) {
				navigate('/devices/list', { replace: true })
			}
		} else {
			setDevices([])
			setSelectedDeviceId(null)
			setSelectedDevice(undefined)
			setLoading(false)
		}
		isInitialMount.current = false
	}, [isAuthenticated, userRole])

	// Синхронизируем selectedDeviceId с URL
	useLayoutEffect(() => {
		if (id) {
			const deviceId = Number(id)
			if (selectedDeviceId !== deviceId) {
				setSelectedDeviceId(deviceId)
				fetchDevice(deviceId)
			}
		} else if (
			devices.length > 0 &&
			selectedDeviceId === null &&
			location.pathname.startsWith('/devices/') &&
			!location.pathname.startsWith('/devices/list')
		) {
			const currentPath = location.pathname.split('/')
			const currentTab = currentPath[2] || 'details'
			setSelectedDeviceId(devices[0].id)
			navigate(`/devices/${currentTab}/${devices[0].id}`, { replace: true })
		}
	}, [id, devices, navigate, location.pathname])

	// Загружаем данные устройства при изменении selectedDeviceId
	useLayoutEffect(() => {
		if (selectedDeviceId && isAuthenticated && !id) {
			fetchDevice(selectedDeviceId)
		}
	}, [selectedDeviceId, isAuthenticated])

	const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newId = Number(e.target.value)
		setSelectedDeviceId(newId)
		const pathParts = location.pathname.split('/')
		const currentTab = pathParts[2] || 'details'
		navigate(`/devices/${currentTab}/${newId}`, { replace: true })
	}

	return (
		<DeviceContext.Provider
			value={{
				selectedDeviceId: selectedDeviceId || 0,
				setSelectedDeviceId,
				handleDeviceChange,
				devices,
				setDevices,
				selectedDevice,
				loading,
				error,
				fetchDevices,
			}}
		>
			{children}
		</DeviceContext.Provider>
	)
}

export const useDevice = () => {
	const context = useContext(DeviceContext)
	if (context === undefined) {
		throw new Error('useDevice must be used within a DeviceProvider')
	}
	return context
}
