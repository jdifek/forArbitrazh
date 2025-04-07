import { createContext, useContext, useState, ReactNode } from 'react'
import { IUser } from '../../api/Users/UsersTypes'

interface UserProfileContextType {
	userData: IUser | null
	setUserData: (data: IUser | null) => void
	loading: boolean
	setLoading: (loading: boolean) => void
	error: string | null
	setError: (error: string | null) => void
	isSidebarOpen: boolean
	setIsSidebarOpen: (isOpen: boolean) => void
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
	undefined
)

interface UserProfileProviderProps {
	children: ReactNode
}

export const UserProfileProvider = ({ children }: UserProfileProviderProps) => {
	const [userData, setUserData] = useState<IUser | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

	return (
		<UserProfileContext.Provider
			value={{
				userData,
				setUserData,
				loading,
				setLoading,
				error,
				setError,
				isSidebarOpen,
				setIsSidebarOpen,
			}}
		>
			{children}
		</UserProfileContext.Provider>
	)
}

export const useUserProfile = () => {
	const context = useContext(UserProfileContext)
	if (!context) {
		throw new Error('useUserProfile must be used within a UserProfileProvider')
	}
	return context
}
