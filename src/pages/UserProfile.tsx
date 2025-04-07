import UserNavigate from '../components/UserProfile/UserNavigate'
import { IoSettingsSharp } from 'react-icons/io5'
import UserSidebar from '../components/UserProfile/UserSidebar'
import { useUserProfile } from '../helpers/context/UserProfileContext'
import UsersService from '../api/Users/UsersService'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../helpers/context/AuthContext'
import { useDevice } from '../helpers/context/DeviceContext'

const formatDate = (dateString: string | undefined) => {
	if (!dateString) return '-'
	const date = new Date(dateString)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	return `${year}-${month}-${day} ${hours}:${minutes}`
}

const UserProfile = () => {
	const { isAuthenticated, userRole } = useAuth()
	const { setSelectedDeviceId } = useDevice()
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

	useEffect(() => {
		const fetchUserData = async () => {
			if (!isAuthenticated) {
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				setError(null)
				let response
				if (id) {
					response = await UsersService.getUserById(Number(id))
				} else {
					response = await UsersService.getMe()
				}
				console.log('User profile data:', response)
				setUserData(response.data)
				console.log('User profile data:', response)
			} catch (err) {
				console.error('Error fetching user data:', err)
				setError('Ошибка при загрузке данных пользователя')
			} finally {
				setLoading(false)
			}
		}

		fetchUserData()
	}, [isAuthenticated, id, setUserData, setLoading, setError])

	const handleDeviceClick = (id: number) => {
		setSelectedDeviceId(id)
	}

	console.log('notified_by:', userData?.notified_by)

	const handleRemoveUser = () => {
		console.log('користувач видалений')
	}

	const handleDeactivateUser = () => {
		console.log('користуча деактивований')
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
				Пользователь не найден
			</div>
		)
	}

	const infoSections = [
		{
			title: 'Основна інформація',
			items: [
				{ label: 'ПІБ', value: userData?.full_name || '-' },
				{ label: 'Дата народження', value: '-' },
				{ label: 'Філія', value: '-' },
				{ label: 'Роль', value: userData?.role || '-' },
				{
					label: 'Дата активності',
					value: formatDate(userData?.last_login) || '-',
				},

				{ label: 'Статус', value: 'Активный' },
			],
		},
		{
			title: 'Апарати що сповіщають',
			items: userData?.notified_by?.map(notified => ({
				label: notified.name,
				value: (
					<Link
						to={`/devices/details/${notified.id}`}
						onClick={() => handleDeviceClick(notified.id)}
						className='text-blue-500 hover:text-blue-700'
					>
						Аппарат №{notified.id}
					</Link>
				),
			})) || [{ label: 'Нет подчиненных', value: '-' }],
		},
		{
			title: 'Дані картки',
			items: [
				{ label: 'Номер картки', value: '-' },
				{ label: 'Код картки', value: '-' },
			],
		},
		{
			title: 'Доступ до апаратів',
			items: userData?.notified_by?.map(notified => ({
				label: notified.name,
				value: (
					<Link
						to={`/devices/details/${notified.id}`}
						onClick={() => handleDeviceClick(notified.id)}
						className='text-blue-500 hover:text-blue-700'
					>
						Аппарат №{notified.id}
					</Link>
				),
			})) || [{ label: 'Нет подчиненных', value: '-' }],
		},
		{
			title: 'Контакти',
			items: [
				{ label: 'Телефон', value: userData?.phone_number || '-' },
				{ label: 'Email', value: userData?.email || '-' },
			],
		},
	]

	console.log('userData:', userData)

	return (
		<div className='p-4 lg:p-8'>
			<div className='flex gap-3 flex-nowrap w-full p-6 lg:max-w-[748px] xl:max-w-[960px] 2xl:max-w-[1440px]'>
				<div className='w-full bg-white rounded-lg shadow p-5 flex flex-col flex-1'>
					<h2 className='text-base md:text-xl font-semibold mb-6'>
						{userData?.full_name}
					</h2>
					<UserNavigate />
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{infoSections.map((section, sectionIndex) => (
							<div key={sectionIndex}>
								<h3 className='text-base md:text-xl font-semibold mb-6'>
									{section.title}
								</h3>
								<div className='space-y-4 border-t border-gray-300'>
									{section.items?.map((item, itemIndex) => (
										<div
											key={itemIndex}
											className='grid grid-cols-2 gap-4  mt-4'
										>
											<div className='text-gray-600 text-xs md:text-base'>
												{item.label}
											</div>
											<div className='text-xs md:text-base'>{item.value}</div>
										</div>
									))}
									{section.title === 'Контакти' &&
										userRole === 'super_admin' && (
											<div className='flex flex-col gap-4 mt-4 border-t border-gray-300'>
												<button
													onClick={handleRemoveUser}
													className='mt-4 py-2 px-4 w-fit min-w-28 bg-red-500 text-white rounded-md hover:bg-red-600 uppercase'
												>
													Видалити
												</button>
												<button
													onClick={handleDeactivateUser}
													className='py-2 px-4 w-fit min-w-28 bg-blue-500 text-white rounded-md hover:bg-blue-600 uppercase'
												>
													Деактивувати користувача
												</button>
											</div>
										)}
								</div>
							</div>
						))}
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

export default UserProfile
