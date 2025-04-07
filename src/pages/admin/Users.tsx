/* временно прописанные роли пользователей */

// export interface IUser {
// 	id: number
// 	role: string
// 	access: string
// 	email: string
// 	full_name: string
// 	phone_number?: string
// }

// const tempUsers: IUser[] = [
// 	{
// 		id: 1,
// 		full_name: 'Иван Петров',
// 		email: 'ivan@example.com',
// 		role: 'Супер администратор',
// 		access: 'Полный',
// 	},
// 	{
// 		id: 2,
// 		full_name: 'Анна Смирнова',
// 		email: 'anna@example.com',
// 		role: 'Администратор',
// 		access: 'Полный',
// 	},
// 	{
// 		id: 3,
// 		full_name: 'Алексей Козлов',
// 		email: 'alexey@example.com',
// 		role: 'Оператор',
// 		access: 'Ограниченный',
// 	},
// 	{
// 		id: 4,
// 		full_name: 'Мария Иванова',
// 		email: 'maria@example.com',
// 		role: 'Водитель',
// 		access: 'Ограниченный',
// 	},
// 	{
// 		id: 5,
// 		full_name: 'Сергей Павлов',
// 		email: 'sergey@example.com',
// 		role: 'Техник',
// 		access: 'Ограниченный',
// 	},
// 	{
// 		id: 6,
// 		full_name: 'Ольга Васильева',
// 		email: 'olga@example.com',
// 		role: 'Инкассатор',
// 		access: 'Ограниченный',
// 	},
// 	{
// 		id: 7,
// 		full_name: 'Дмитрий Сидоров',
// 		email: 'dmitry@example.com',
// 		role: 'Бухгалтер',
// 		access: 'Полный',
// 	},
// ]

// const Users = () => {
// 	return (
// 		<div className='p-4 lg:p-8'>
// 			<div className='bg-white rounded-lg shadow'>
// 				<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
// 					<h3 className='text-lg leading-6 font-medium text-gray-900'>
// 						Пользователи
// 					</h3>
// 					<button className='bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600'>
// 						Добавить пользователя
// 					</button>
// 				</div>

// 				<div className='overflow-x-auto'>
// 					<table className='min-w-full divide-y divide-gray-200'>
// 						<thead className='bg-gray-50'>
// 							<tr>
// 								<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
// 									Имя
// 								</th>
// 								<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
// 									Email
// 								</th>
// 								<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
// 									Роль
// 								</th>
// 								<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
// 									Доступ
// 								</th>
// 								<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
// 									Статус
// 								</th>
// 								<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
// 									Действия
// 								</th>
// 							</tr>
// 						</thead>
// 						<tbody className='bg-white divide-y divide-gray-200'>
// 							{tempUsers.map(user => (
// 								<tr key={user.id}>
// 									<td className='px-6 py-4 whitespace-nowrap'>
// 										<div className='text-sm font-medium text-gray-900'>
// 											{user.full_name}
// 										</div>
// 									</td>
// 									<td className='px-6 py-4 whitespace-nowrap'>
// 										<div className='text-sm text-gray-500'>{user.email}</div>
// 									</td>
// 									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
// 										{user.role}
// 									</td>
// 									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
// 										{user.access}
// 									</td>
// 									<td className='px-6 py-4 whitespace-nowrap'>
// 										<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
// 											Активный
// 										</span>
// 									</td>
// 									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
// 										<button className='text-blue-600 hover:text-blue-900 mr-3'>
// 											Изменить
// 										</button>
// 										<button className='text-red-600 hover:text-red-900'>
// 											Удалить
// 										</button>
// 									</td>
// 								</tr>
// 							))}
// 						</tbody>
// 					</table>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default Users

import { useEffect, useState } from 'react'
import { IUser } from '../../api/Users/UsersTypes'
import UsersService from '../../api/Users/UsersService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../helpers/context/AuthContext'

const Users = () => {
	const [users, setUsers] = useState<IUser[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()
	const { userRole } = useAuth()

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const res = await UsersService.getUsers()
				console.log(res.data)
				setUsers(res.data.results)
			} catch (error) {
				console.error('Ошибка при получении пользователей:', error)
				setError('Не удалось загрузить пользователей.')
			} finally {
				setIsLoading(false)
			}
		}

		fetchUsers()
	}, [])

	const handleUserClick = (userId: number) => {
		navigate(`/profile/${userId}`)
	}

	const handleUpdateUserClick = (userId: number) => {
		navigate(`/profile/${userId}/edit`)
	}

	return (
		<div className='p-4 lg:p-8'>
			<div className='bg-white shadow-lg rounded-lg w-full p-6 mx-auto sm:max-w-[640px] md:max-w-full lg:max-w-[700px] max-w-3lg max-w-2lg xl:max-w-full 2xl:max-w-full'>
				<div className='px-4 py-5 sm:px-6 flex justify-between items-center max-sm:flex-wrap max-sm:gap-3'>
					<h3 className='text-lg leading-6 font-medium text-gray-900'>
						Пользователи
					</h3>
					{userRole !== 'admin' && (
						<button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base'>
							Добавить пользователя
						</button>
					)}
				</div>
				{isLoading ? (
					<div className='flex justify-center items-center py-6'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
					</div>
				) : error ? (
					<p className='text-center text-red-500 p-4'>{error}</p>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Имя
									</th>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Email
									</th>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Роль
									</th>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Доступ
									</th>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Статус
									</th>
									{userRole !== 'admin' && (
										<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Действия
										</th>
									)}
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{users ? (
									users.map(user => (
										<tr key={user.id}>
											<td className='px-4 py-3 whitespace-nowrap'>
												<div
													className='text-sm font-medium text-blue-500 hover:text-blue-700 cursor-pointer'
													onClick={() => handleUserClick(user.id)}
												>
													{user.full_name}
												</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												<div className='text-sm text-gray-500'>
													{user.email}
												</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
												{user.role}
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
												{user.access}
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
													Активный
												</span>
											</td>
											{userRole !== 'admin' && (
												<td className='px-4 py-3 whitespace-nowrap text-sm font-medium'>
													<button
														className='text-blue-600 hover:text-blue-900 mr-3'
														onClick={() => handleUpdateUserClick(user.id)}
													>
														Изменить
													</button>
													<button className='text-red-600 hover:text-red-900'>
														Удалить
													</button>
												</td>
											)}
										</tr>
									))
								) : (
									<p className='text-gray-400 font-semibold text-lg'>
										Пользователи не найдены
									</p>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}

export default Users
