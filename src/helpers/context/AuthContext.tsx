import React, { createContext, useContext, useEffect, useState } from 'react'
import StatsService from '../../api/Stats/StatsService'
import {
	CurrentDailyStats,
	CurrentDaySummary,
} from '../../api/Stats/StatsTypes'
import { jwtDecode } from 'jwt-decode'
import UsersService from '../../api/Users/UsersService'

interface AuthContextType {
	isAuthenticated: boolean
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
	currentDaySummary: CurrentDaySummary | null
	setCurrentDaySummary: React.Dispatch<
		React.SetStateAction<CurrentDaySummary | null>
	>
	currentDailyStats: CurrentDailyStats[]
	setCurrentDailyStats: React.Dispatch<
		React.SetStateAction<CurrentDailyStats[]>
	>
	loading: boolean
	fetchStats: () => Promise<void>
	isLoginModalOpen: boolean
	setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>
	userRole: string | null
	setUserRole: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		!!localStorage.getItem('authToken')
	)
	const [currentDaySummary, setCurrentDaySummary] =
		useState<CurrentDaySummary | null>(null)
	const [currentDailyStats, setCurrentDailyStats] = useState<
		CurrentDailyStats[]
	>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
	const [userRole, setUserRole] = useState<string | null>(null)
	const rolesWithoutStats = ['technician', 'driver', 'operator']

	// Функция для декодирования токена
	const decodeToken = (token: string): { user_id?: number } => {
		try {
			const decoded = jwtDecode<{ user_id?: number }>(token)
			return decoded
		} catch (error) {
			console.error('❌ Ошибка декодирования токена:', error)
			return {}
		}
	}

	// Инициализация авторизации
  useEffect(() => {
    const initializeAuth = async () => {
      const authToken = localStorage.getItem('authToken')
      const refreshToken = localStorage.getItem('refreshToken')
  
      try {
        if (authToken) {
          const decoded = decodeToken(refreshToken)
          const userId = decoded.user_id
  
          if (userId) {
            // Запрашиваем данные текущего пользователя через getMe
            const userResponse = await UsersService.getMe()
            const role = userResponse.data.role
            if (role) {
              setUserRole(role)
              localStorage.setItem('userRole', role) // Сохраняем роль в localStorage
              setIsAuthenticated(true)
            } else {
              throw new Error('Роль не найдена в данных пользователя')
            }
          } else {
            throw new Error('user_id не найден в токене')
          }
        } else if (refreshToken) {
          // Попробуем обновить токен, используя refreshToken
          const decodedRefresh = decodeToken(refreshToken)
          const refreshUserId = decodedRefresh.user_id
  
          if (refreshUserId) {
            const refreshResponse = await UsersService.refreshUserToken({
              refresh: refreshToken,
            })
            console.log('Refresh token response:', refreshResponse)

            const newAccessToken = refreshResponse.access
            localStorage.setItem('authToken', newAccessToken)
  
            // Повторно декодируем новый access token
            const newDecoded = decodeToken(newAccessToken)
            const newUserId = newDecoded.user_id
  
            if (newUserId) {
              const userResponse = await UsersService.getMe()
              const role = userResponse.data.role
              if (role) {
                setUserRole(role)
                localStorage.setItem('userRole', role) // Сохраняем роль в localStorage
                setIsAuthenticated(true)
              } else {
                throw new Error('Роль не найдена в данных пользователя')
              }
            } else {
              throw new Error('user_id не найден в новом токене')
            }
          } else {
            throw new Error('user_id не найден в refresh token')
          }
        } else {
          setIsAuthenticated(false)
          setUserRole(null)
          setIsLoginModalOpen(true)
        }
      } catch (error) {
        console.error('Ошибка инициализации авторизации:', error)
        setIsAuthenticated(false)
        setUserRole(null)
        localStorage.removeItem('userRole') // Удаляем роль из localStorage при ошибке
        setIsLoginModalOpen(true)
      } finally {
        setLoading(false)
      }
    }
  
    initializeAuth()
  }, [])
  

	const fetchStats = async () => {
		setLoading(true)
		try {
			const dateFn = new Date().toISOString().split('T')[0]
			const dateStDate = new Date()
			dateStDate.setDate(dateStDate.getDate() - 30)
			const dateSt = `${dateStDate.getFullYear()}-${String(
				dateStDate.getMonth() + 1
			).padStart(2, '0')}-${String(dateStDate.getDate()).padStart(2, '0')}`

			const [daySummaryRes, currentDailyRes] = await Promise.all([
				StatsService.currentDaySummary(),
				StatsService.currentDaily(dateSt, dateFn),
			])
			setCurrentDaySummary(daySummaryRes.data)
			setCurrentDailyStats(currentDailyRes.data.results)
		} catch (error) {
			console.log('Fetch stats failed with error:', error)
			console.log('Error status:', error.response?.status)
			console.log('Error data:', error.response?.data)
			if (error.response?.status === 401) {
				setIsAuthenticated(false)
				setIsLoginModalOpen(true)
				setUserRole(null)
				localStorage.removeItem('userRole')
			}
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (isAuthenticated && userRole && !rolesWithoutStats.includes(userRole)) {
			fetchStats()
		} else if (!isAuthenticated) {
			setCurrentDaySummary(null)
			setCurrentDailyStats([])
			setUserRole(null)
			localStorage.removeItem('userRole')
			setLoading(false)
		}
	}, [isAuthenticated, userRole])

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				setIsAuthenticated,
				currentDaySummary,
				setCurrentDaySummary,
				currentDailyStats,
				setCurrentDailyStats,
				loading,
				fetchStats,
				isLoginModalOpen,
				setIsLoginModalOpen,
				userRole,
				setUserRole,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
