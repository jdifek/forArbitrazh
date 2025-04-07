import { NavLink } from 'react-router-dom'
import { useDevice } from '../../helpers/context/DeviceContext'
import { useAuth } from '../../helpers/context/AuthContext'

export const DeviceNavigate = () => {
	const { selectedDeviceId } = useDevice()
	const { userRole } = useAuth()

	console.log('selectedDeviceId:', selectedDeviceId)

	if (!selectedDeviceId) return <p>Устройство не выбрано</p>

	const allMenuItems = [
		{ name: 'Подробно', path: `/devices/details/${selectedDeviceId}` },
		{ name: 'Настройки', path: `/devices/settings/${selectedDeviceId}` },
		{ name: 'Регламент', path: `/devices/regulations/${selectedDeviceId}` },
		{ name: 'Замена значений', path: `/devices/replacing/${selectedDeviceId}` },
		{ name: 'Заправка', path: `/devices/refill/${selectedDeviceId}` },
		{ name: 'Конфигурация', path: `/devices/config/${selectedDeviceId}` },
	]

	const menuItems =
		userRole === 'driver'
			? allMenuItems.filter(
					item => item.name === 'Подробно' || item.name === 'Заправка'
			  )
			: userRole === 'technician'
			? allMenuItems.filter(item => item.name !== 'Заправка')
			: allMenuItems
	return (
		<ul className='flex flex-wrap gap-2 mb-4'>
			{menuItems.map(({ name, path }) => (
				<li key={name} className='p-2 rounded-lg text-sm md:text-base'>
					<NavLink
						to={path}
						className={({ isActive }) =>
							`p-2 rounded-lg ${
								isActive
									? 'bg-blue-500 text-white shadow-md'
									: 'text-black hover:underline'
							}`
						}
					>
						{name}
					</NavLink>
				</li>
			))}
		</ul>
	)
}
