import { useDevice } from '../../helpers/context/DeviceContext'

export const SelectDevice = () => {
	const { selectedDeviceId, handleDeviceChange, devices, loading, error } =
		useDevice()

	if (loading) return <p>Загрузка устройств...</p>
	if (error) return <p className='text-red-500'>{error}</p>
	if (devices.length === 0) {
		return <p>Устройства не найдены</p>
	}

	return (
		<select
			className='w-full max-w-[275px] mb-3 border p-2 rounded text-sm md:text-base'
			value={selectedDeviceId || ''}
			onChange={handleDeviceChange}
		>
			{devices.map(device => (
				<option key={device.id} value={device.id}>
					{device.name}
				</option>
			))}
		</select>
	)
}

// import { devices } from '../../data/device/device'
// import { useDevice } from '../../helpers/context/DeviceContext'

// export const SelectDevice = () => {
// 	const { selectedDeviceId, handleDeviceChange } = useDevice()

// 	return (
// 		<select
// 			className='mb-3 border p-2 rounded'
// 			value={selectedDeviceId}
// 			onChange={handleDeviceChange}
// 		>
// 			{devices.map(device => (
// 				<option key={device.id} value={device.id}>
// 					{device.name}
// 				</option>
// 			))}
// 		</select>
// 	)
// }
