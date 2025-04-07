import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UsersService from '../../api/Users/UsersService'
import { IUserUpdateParams } from '../../api/Users/UsersTypes'
import UserNavigate from './UserNavigate'
import { IoSettingsSharp } from 'react-icons/io5'
import UserSidebar from './UserSidebar'
import { useUserProfile } from '../../helpers/context/UserProfileContext'

const EditTab = () => {
	const { id } = useParams<{ id: string }>()
	const {
		userData,
		setUserData,
		loading,
		setLoading,
		error,
		setError,
		isSidebarOpen,
		setIsSidebarOpen,
	} = useUserProfile()
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [formError, setFormError] = useState<string | null>(null)
	const [passwordData, setPasswordData] = useState({
		password1: '',
		password2: '',
	})
	const [isPasswordSaving, setIsPasswordSaving] = useState<boolean>(false)
	const [passwordError, setPasswordError] = useState<string | null>(null)

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true)
				setError(null)
				let response
				if (id) {
					response = await UsersService.getUserById(Number(id))
				} else {
					response = await UsersService.getMe()
				}
				setUserData(response.data)
				console.log('User profile data:', response)
			} catch (err) {
				console.error('Ошибка при загрузке данных пользователя:', err)
				setError('Не удалось загрузить данные пользователя.')
			} finally {
				setLoading(false)
			}
		}

		fetchUserData()
	}, [id, setUserData, setLoading, setError])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setUserData(prev => (prev ? { ...prev, [name]: value } : null))
	}

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setPasswordData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!userData) return

		setIsSaving(true)
		setFormError(null)
		try {
			const updateParams: IUserUpdateParams = {
				full_name: userData.full_name,
				username: userData.username,
				phone_number: userData.phone_number,
				email: userData.email,
				role: userData.role,
			}
			const updatedUser = await UsersService.updateUser(
				userData.id,
				updateParams
			)
			setUserData(updatedUser.data)
			console.log('Пользователь обновлён:', updatedUser)
		} catch (err) {
			console.error('Ошибка при обновлении пользователя:', err)
			setFormError('Не удалось сохранить изменения.')
		} finally {
			setIsSaving(false)
		}
	}

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!userData) return
		if (passwordData.password1 !== passwordData.password2) {
			setPasswordError('Пароли не совпадают.')
			return
		}

		setIsPasswordSaving(true)
		setPasswordError(null)
		try {
			await UsersService.setUserPassword(userData.id, {
				password1: passwordData.password1,
				password2: passwordData.password2,
			})
			console.log('Пароль успешно изменён')
			setPasswordData({ password1: '', password2: '' })
		} catch (err) {
			console.error('Ошибка при изменении пароля:', err)
			setPasswordError('Не удалось изменить пароль.')
		} finally {
			setIsPasswordSaving(false)
		}
	}

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
			</div>
		)
	}

	if (error) {
		return <div className='text-center text-red-500 p-4'>{error}</div>
	}

	if (!userData) {
		return (
			<div className='text-center text-gray-500 p-4'>
				Пользователь не найден.
			</div>
		)
	}

	return (
		<div className='p-4 lg:p-8'>
			<div className='flex gap-3 flex-nowrap w-full p-6 lg:max-w-[748px] xl:max-w-[960px] 2xl:max-w-[1440px]'>
				<div className='w-full bg-white rounded-lg shadow p-5 pb-16 flex flex-col flex-1'>
					<h2 className='text-base md:text-xl font-semibold mb-6'>
						{userData.full_name}
					</h2>
					<UserNavigate />
					<div className='mt-10'>
						<form onSubmit={handleSubmit} className='space-y-8 sm:w-1/2'>
							{/* fullname */}
							<div className='flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4'>
								<label className='block text-sm font-medium text-gray-700 sm:w-fit sm:min-w-16'>
									ПІБ
								</label>
								<input
									type='text'
									name='full_name'
									value={userData.full_name || ''}
									onChange={handleChange}
									className='mt-1 py-1 px-2 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>
							{/* username */}
							<div className='flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4'>
								<label className='block text-sm font-medium text-gray-700 sm:w-fit sm:min-w-16'>
									Логін
								</label>
								<input
									type='text'
									name='username'
									value={userData.username || ''}
									onChange={handleChange}
									className='mt-1 py-1 px-2 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>
							{/* phone number */}
							<div className='flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4'>
								<label className='block text-sm font-medium text-gray-700 sm:w-fit sm:min-w-16'>
									Телефон
								</label>
								<input
									type='text'
									name='phone_number'
									value={userData.phone_number || ''}
									onChange={handleChange}
									className='mt-1 py-1 px-2 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>
							{/* email */}
							<div className='flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4'>
								<label className='block text-sm font-medium text-gray-700 sm:w-fit sm:min-w-16'>
									Email
								</label>
								<input
									type='email'
									name='email'
									value={userData.email || ''}
									onChange={handleChange}
									className='mt-1 py-1 px-2 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>
							{/* role */}
							<div className='flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4'>
								<label className='block text-sm font-medium text-gray-700 sm:w-fit sm:min-w-16'>
									Роль
								</label>
								<select
									name='role'
									value={userData.role || ''}
									onChange={handleChange}
									disabled={userData.role === 'super_admin'}
									className='mt-1 py-1 px-2 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								>
									<option value='admin'>Admin</option>
									<option value='operator'>Operator</option>
									<option value='driver'>Driver</option>
									<option value='technician'>Technician</option>
									<option value='collector'>Collector</option>
									<option value='accountant'>Accountant</option>
								</select>
							</div>
							{formError && <p className='text-red-500'>{formError}</p>}
							<button
								type='submit'
								disabled={isSaving}
								className={`w-fit min-w-32 py-2 px-4 rounded-md text-white uppercase ${
									isSaving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
								}`}
							>
								{isSaving ? 'Збереження...' : 'Зберегти'}
							</button>
						</form>
					</div>

					{/* set password form */}
					<div className='mt-6'>
						<form
							onSubmit={handlePasswordSubmit}
							className='space-y-6 sm:w-1/2'
						>
							<div className='flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4'>
								<label className='block text-sm font-medium text-gray-700 sm:w-fit sm:min-w-16 sm:w-[60%]'>
									Новий пароль
								</label>
								<input
									type='password'
									name='password1'
									value={passwordData.password1}
									onChange={handlePasswordChange}
									className='mt-1 py-1 px-2 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>
							<div className='flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4'>
								<label className='block text-sm font-medium text-gray-700 sm:w-[60%]'>
									Підтвердження пароля
								</label>
								<input
									type='password'
									name='password2'
									value={passwordData.password2}
									onChange={handlePasswordChange}
									className='mt-1 py-1 px-2 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>
							{passwordError && <p className='text-red-500'>{passwordError}</p>}
							<button
								type='submit'
								disabled={isPasswordSaving}
								className={`w-fit min-w-40 uppercase py-2 px-4 rounded-md text-white ${
									isPasswordSaving
										? 'bg-gray-400'
										: 'bg-blue-500 hover:bg-blue-600'
								}`}
							>
								{isPasswordSaving ? 'Зміна...' : 'Змінити пароль'}
							</button>
						</form>
					</div>
				</div>
				<button
					className='xl:hidden fixed top-16 right-4 z-50 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg shadow-md'
					onClick={() => setIsSidebarOpen(true)}
				>
					<IoSettingsSharp size={24} />
				</button>
				<UserSidebar
					userData={userData}
					loading={loading}
					isOpen={isSidebarOpen}
					setIsOpen={setIsSidebarOpen}
				/>
			</div>
		</div>
	)
}

export default EditTab
