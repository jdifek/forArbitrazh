import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TokenService from '../../api/Token/TokenService'
import { useAuth } from '../../helpers/context/AuthContext'
import { useDevice } from '../../helpers/context/DeviceContext'
import UsersService from '../../api/Users/UsersService'

interface ModalLoginProps {
	isOpen: boolean
	onClose: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ModalLogin({ isOpen, onClose }: ModalLoginProps) {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { fetchDevices } = useDevice()
	const { setIsAuthenticated, fetchStats, setUserRole } = useAuth()
	const navigate = useNavigate()

	const adminRoles = ['super_admin', 'admin', 'accountant']
	const deviceRoles = ['operator', 'driver', 'technician', 'collector']

	if (!isOpen) return null

	const handleLogin = async () => {
		try {
			setIsLoading(true)
			setError(null)
			const res = await TokenService.getToken({ username, password })

			// Сохраняем токены
			localStorage.setItem('authToken', res.data.access)
			localStorage.setItem('refreshToken', res.data.refresh)

			const user = await UsersService.getMe()
			console.log(user)
			const role = user.data.role

			setIsAuthenticated(true)
			setUserRole(role)

			localStorage.setItem('userRole', role)

			await Promise.all([fetchDevices, fetchStats])
			if (adminRoles.includes(role)) {
				navigate('/')
			} else if (deviceRoles.includes(role)) {
				navigate('/devices/list')
			} else {
				navigate('/')
			}
			onClose(false)
		} catch (error) {
			console.error('Login error:', error)
			setError('Неверный логин или пароль')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-blue-500'>
			<div className='bg-white rounded-2xl p-6 w-80 shadow-lg relative'>
				<h2 className='text-xl font-semibold text-center text-gray-500 mb-2'>
					Вхід
				</h2>
				<p className='text-center text-gray-500 mb-4'>H2O CRM акаунт</p>

				{error && <p className='text-red-500 text-center'>{error}</p>}

				{isLoading ? (
					<div className='flex justify-center items-center py-6'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
					</div>
				) : (
					<>
						<div className='space-y-3'>
							<div className='relative'>
								<input
									type='text'
									placeholder='Name'
									value={username}
									onChange={e => setUsername(e.target.value)}
									className='w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
								/>
							</div>
							<div className='relative'>
								<input
									type='password'
									value={password}
									onChange={e => setPassword(e.target.value)}
									placeholder='●●●●●●●●'
									className='w-full px-4 text-black py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
								/>
							</div>

							<label className='flex items-center space-x-2 text-gray-600 text-sm'>
								<input type='checkbox' className='w-4 h-4' />
								<span>Запам’ятати мене</span>
							</label>

							<button
								onClick={handleLogin}
								className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600'
							>
								УВІЙТИ
							</button>
						</div>

						<button
							onClick={() => onClose(false)}
							className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
						>
							✕
						</button>
					</>
				)}
			</div>
		</div>
	)
}
