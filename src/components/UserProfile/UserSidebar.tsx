import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../helpers/context/AuthContext'
import { IoClose } from 'react-icons/io5'
import { IUser } from '../../api/Users/UsersTypes'

interface UserSidebarProps {
	userData: IUser | null
	loading: boolean
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
}

const UserSidebar = ({
	userData,
	loading,
	isOpen,
	setIsOpen,
}: UserSidebarProps) => {
	const navigate = useNavigate()
	const location = useLocation() // Получаем текущий путь
	const { setIsAuthenticated, setUserRole, setIsLoginModalOpen } = useAuth()

	const handleLogout = () => {
		localStorage.removeItem('authToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('userRole')

		setIsAuthenticated(false)
		setUserRole(null)
		setIsLoginModalOpen(true)

		navigate('/')
	}

	// Условие для отображения кнопки выхода
	const showLogoutButton = location.pathname === '/profile'

	return (
		<div
			className={`
                fixed xl:static inset-y-0 right-0 transform 
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                xl:translate-x-0 transition-transform duration-200 ease-in-out
                z-50 xl:z-0 w-64 bg-white rounded-lg shadow p-4
            `}
		>
			{/* Аватарка */}
			<div className='flex flex-col items-center mb-6'>
				<div className='w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-3'>
					<span className='text-gray-500 text-2xl'>👤</span>
				</div>
				<p className='text-sm text-gray-500 uppercase'>
					{loading ? 'Загрузка...' : userData?.role || 'Роль не указана'}
				</p>
				<p className='text-lg font-semibold text-gray-800'>
					{loading ? 'Загрузка...' : userData?.full_name || 'Пользователь'}
				</p>
			</div>

			<div className='flex justify-between items-center mb-4 xl:hidden'>
				<h2 className='text-lg font-semibold'>Настройки</h2>
				<button
					onClick={() => setIsOpen(false)}
					className='text-gray-500 hover:text-gray-700'
				>
					<IoClose size={24} />
				</button>
			</div>
			<div className='space-y-4 mt-0'>
				{/* Кнопка выхода показывается только на /profile */}
				{showLogoutButton && (
					<button
						onClick={handleLogout}
						className='w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600'
					>
						Выйти
					</button>
				)}
			</div>
		</div>
	)
}

export default UserSidebar
