import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
	LayoutDashboard,
	MonitorSmartphone,
	BarChart3,
	CreditCard,
	Wrench,
	// Settings,
	Users,
	ChevronDown,
	ChevronRight,
	X,
} from 'lucide-react'
import { useAuth } from '../helpers/context/AuthContext'
import { useDevice } from '../helpers/context/DeviceContext'

interface NavItemProps {
	icon: React.ReactNode
	text: string
	path?: string
	children?: { text: string; path: string; allowedRoles: string[] }[]
	allowedRoles?: string[]
	onClose?: () => void
}

const NavItem: React.FC<NavItemProps> = ({
	icon,
	text,
	path,
	children,
	allowedRoles,
	onClose,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const { userRole } = useAuth()

	if (allowedRoles && !allowedRoles.includes(userRole || '')) {
		return null
	}

	const isActive = (itemPath: string) => location.pathname === itemPath
	const isChildActive = children?.some(
		child => location.pathname === child.path
	)

	const handleClick = (e: React.MouseEvent, targetPath?: string) => {
		e.stopPropagation() // Останавливает всплытие события
		if (targetPath) {
			navigate(targetPath)
			if (onClose) onClose()
		}
	}

	if (!children) {
		return (
			<div
				className={`text-gray-300 hover:bg-gray-700 cursor-pointer ${
					isActive(path!) ? 'bg-gray-700' : ''
				}`}
				onClick={e => handleClick(e, path)}
			>
				<div className='flex items-center px-4 py-2'>
					<span className='mr-2'>{icon}</span>
					<span>{text}</span>
				</div>
			</div>
		)
	}

	const filteredChildren = children.filter(child =>
		child.allowedRoles.includes(userRole || '')
	)

	if (filteredChildren.length === 0) {
		return null
	}

	return (
		<div>
			<div
				className={`text-gray-300 hover:bg-gray-700 cursor-pointer ${
					isChildActive ? 'bg-gray-700' : ''
				}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className='flex items-center px-4 py-2'>
					<span className='mr-2'>{icon}</span>
					<span>{text}</span>
					<span className='ml-auto'>
						{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
					</span>
				</div>
			</div>
			{isOpen && (
				<div className='bg-gray-800'>
					{filteredChildren.map((item, index) => (
						<div
							key={index}
							className={`pl-12 py-2 text-gray-400 hover:bg-gray-700 cursor-pointer text-sm ${
								isActive(item.path) ? 'bg-gray-700' : ''
							}`}
							onClick={e => handleClick(e, item.path)}
						>
							{item.text}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
	const { selectedDeviceId } = useDevice()

	const menuItems = [
		{
			icon: <LayoutDashboard size={20} />,
			text: 'Главная',
			path: '/',
			allowedRoles: ['super_admin', 'admin', 'accountant'],
		},
		{
			icon: <MonitorSmartphone size={20} />,
			text: 'Аппараты',
			children: [
				{
					text: 'Список',
					path: '/devices/list',
					allowedRoles: [
						'super_admin',
						'admin',
						'operator',
						'driver',
						'technician',
						'collector',
					],
				},
				{
					text: 'Детально',
					path: `/devices/details/${selectedDeviceId || 1}`,
					allowedRoles: [
						'super_admin',
						'admin',
						'driver',
						'technician',
						'collector',
					],
				},
			],
		},
		{
			icon: <BarChart3 size={20} />,
			text: 'Статистика',
			children: [
				{
					text: 'Продажи',
					path: '/stats/sales',
					allowedRoles: ['super_admin', 'admin', 'accountant'],
				},
				{
					text: 'По дням',
					path: '/stats/by-days',
					allowedRoles: ['super_admin', 'admin', 'accountant'],
				},
				{
					text: 'За сутки',
					path: '/stats/daily',
					allowedRoles: ['super_admin', 'admin', 'accountant'],
				},
				{
					text: 'Аппараты',
					path: '/stats/devices',
					allowedRoles: ['super_admin', 'admin', 'accountant'],
				},
				{
					text: 'Инкассация',
					path: '/stats/collection',
					allowedRoles: ['super_admin', 'admin', 'accountant'],
				},
				{
					text: 'По литражу',
					path: '/stats/by-liters',
					allowedRoles: ['super_admin', 'admin', 'accountant'],
				},
				{
					text: 'Годовой отчет',
					path: '/stats/yearly',
					allowedRoles: ['super_admin', 'admin', 'accountant'],
				},
			],
		},
		{
			icon: <CreditCard size={20} />,
			text: 'Карточки',
			path: '/cards/list',
			allowedRoles: ['super_admin', 'admin'],
		},
		{
			icon: <Wrench size={20} />,
			text: 'Обслуживание',
			children: [
				{
					text: 'История обслуживания',
					path: '/maintenance/history',
					allowedRoles: ['super_admin', 'admin'],
				},
			],
		},
		{
			icon: <Users size={20} />,
			text: 'Администрирование',
			children: [
				{
					text: 'Пользователи',
					path: '/admin/users',
					allowedRoles: ['super_admin', 'admin'],
				},
			],
		},
	]

	return (
		<div className='bg-gray-900 w-64 min-h-screen flex flex-col sticky top-0 z-50'>
			<div className='p-4 text-white text-xl font-bold border-b border-gray-700 flex justify-between items-center'>
				<span>НАЗВА</span>
				<button
					onClick={onClose}
					className='lg:hidden hover:bg-gray-700 p-1 rounded'
				>
					<X size={20} className='text-gray-400' />
				</button>
			</div>
			<nav className='flex-1 overflow-y-auto'>
				{menuItems.map((item, index) => (
					<NavItem
						key={index}
						icon={item.icon}
						text={item.text}
						path={item.path}
						children={item.children}
						allowedRoles={item.allowedRoles}
						onClose={onClose} // Передаём onClose в NavItem
					/>
				))}
			</nav>
		</div>
	)
}

export default Sidebar
