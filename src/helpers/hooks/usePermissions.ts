import { useAuth } from '../context/AuthContext'

const usePermissions = () => {
	const { userRole } = useAuth()
	const allowedRoles = ['super_admin', 'admin', 'technician', 'driver']

	const canEdit = allowedRoles.includes(userRole)

	return { canEdit }
}

export default usePermissions
