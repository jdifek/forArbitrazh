import { NavLink, useParams } from 'react-router-dom'
import { useAuth } from '../../helpers/context/AuthContext'

const UserNavigate = () => {
	const { id } = useParams<{ id: string }>()
	const { userRole } = useAuth()
	const basePath = id ? `/profile/${id}` : '/profile'
	const menuItems = [
		{ name: 'Профіль', path: `${basePath}`, exact: true },
		{ name: 'Активність', path: `${basePath}/activity`, exact: false },
		...(userRole === 'super_admin'
			? [{ name: 'Редагувати', path: `${basePath}/edit`, exact: false }]
			: []),
	]

	return (
		<ul className='flex flex-wrap gap-2 mb-8'>
			{menuItems.map(({ name, path, exact }) => (
				<li key={name} className='p-2 rounded-lg text-sm md:text-base'>
					<NavLink
						to={path}
						end={exact}
						className={({ isActive }) =>
							`px-4 py-2 rounded-full uppercase text-sm ${
								name === 'Активність'
									? 'cursor-not-allowed bg-transparent text-gray-700 pointer-events-none'
									: isActive
									? 'bg-blue-500 text-white shadow-md'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:bg-gray-300'
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

export default UserNavigate
