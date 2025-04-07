import { DeviceSidebar } from '../../components/Device/DeviceSidebar'
import { DeviceNavigate } from '../../components/Device/Navigate'
import { SelectDevice } from '../../components/Device/SelectDevice'
import { useDevice } from '../../helpers/context/DeviceContext'
import { useAuth } from '../../helpers/context/AuthContext'
import { IoSettingsSharp } from 'react-icons/io5'
import useSidebar from '../../helpers/hooks/useSidebar'

const DeviceDetails = () => {
	const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
	const { selectedDevice, loading, error } = useDevice()
	const { userRole } = useAuth()

	if (loading) return <p>Загрузка устройства...</p>
	if (error) return <p className='text-red-500'>{error}</p>
	if (!selectedDevice) return <p>Устройство не найдено</p>

	const getInfoSections = () => {
		switch (userRole) {
			case 'super_admin':
			case 'admin':
			case 'operator':
			case 'collector':
				return [
					{
						title: 'Аппарат',
						items: [
							{ label: 'IMEI', value: selectedDevice.imei },
							{ label: 'Серийный номер', value: selectedDevice.serial_number },
							{ label: 'Объем резервуара', value: selectedDevice.tank_size },
							{ label: 'Модель аппарата', value: selectedDevice.device_model },
							{
								label: 'Модель купюроприемника',
								value: selectedDevice.bill_acceptor_model,
							},
							{
								label: 'Модель монетоприемника',
								value: selectedDevice.coin_acceptor_model,
							},
							{
								label: 'Интерфейс пользователя',
								value: selectedDevice.user_interface,
							},
							{
								label: 'Язык интерфейса',
								value: selectedDevice.interface_language,
							},
							{ label: 'Страна', value: selectedDevice.country },
							{ label: 'Город', value: selectedDevice.city },
							{ label: 'Улица', value: selectedDevice.street },
							{ label: 'Дом', value: selectedDevice.house },
							{ label: 'Широта', value: selectedDevice.latitude },
							{ label: 'Долгота', value: selectedDevice.longitude },
						],
					},
					{
						title: 'Датчики',
						items: [
							{ label: 'Температура', value: selectedDevice.temperature },
							{ label: 'ТДС', value: selectedDevice.tds },
						],
					},
					{
						title: 'Счетчики',
						items: [
							{
								label: 'Остаток продукта',
								value: selectedDevice.product_balance,
							},
							{
								label: 'Счетчик воды на входе',
								value: selectedDevice.water_inlet_counter,
							},
							{
								label: 'Счетчик электрической энергии',
								value: selectedDevice.electricity_counter,
							},
						],
					},
					{
						title: 'Статистика',
						items: [
							{
								label: 'Всего продано воды со дня запуска',
								value: selectedDevice.total_water_sold,
							},
							{
								label: 'Всего выручено денег со дня запуска',
								value: selectedDevice.total_money_earned,
							},
							{
								label: 'Количество монет за все время',
								value: selectedDevice.total_coins_quantity,
							},
							{
								label: 'Сумма монет за все время',
								value: selectedDevice.total_coins_earned,
							},
							{
								label: 'Количество купюр за все время',
								value: selectedDevice.total_bills_quantity,
							},
							{
								label: 'Сумма купюр за все время',
								value: selectedDevice.total_bills_earned,
							},
						],
					},
					{
						title: 'Связь',
						items: [
							{
								label: 'Тип подключения',
								value: selectedDevice.connection_type,
							},
							{
								label: 'Номер SIM-карты',
								value: selectedDevice.sim_card_number,
							},
							{
								label: 'Оператор связи',
								value: selectedDevice.telecom_operator,
							},
							{ label: 'Уровень сигнала', value: selectedDevice.signal_level },
							{
								label: 'Баланс SIM-карты',
								value: selectedDevice.sim_card_balance,
							},
							{
								label: 'Дата последней активности',
								value: selectedDevice.date_of_last_activity,
							},
						],
					},
					{
						title: 'Продукты',
						items:
							selectedDevice.products && selectedDevice.products.length
								? selectedDevice.products.map(product => ({
										label: `Цена "${product.name}"`,
										value: product.price,
								  }))
								: [{ label: 'Продукты отсутствуют', value: '-' }],
					},
					{
						title: 'Программное обеспечение',
						items: [
							{
								label: 'Версия прошивки главного контроллера',
								value: selectedDevice.main_controller_firmware_version,
							},
							{
								label: 'Версия прошивки контроллера подготовки воды',
								value:
									selectedDevice.water_preapration_controller_firmware_version,
							},
							{
								label: 'Версия прошивки контроллера Дисплея',
								value: selectedDevice.display_controller_firmware_version,
							},
							{
								label: 'Дата прошивки главного контроллера',
								value: selectedDevice.main_controller_firmware_date,
							},
						],
					},
				]
			case 'driver':
				return [
					{
						title: 'Аппарат',
						items: [
							{ label: 'Объем резервуара', value: selectedDevice.tank_size },
							{ label: 'Страна', value: selectedDevice.country },
							{ label: 'Город', value: selectedDevice.city },
							{ label: 'Улица', value: selectedDevice.street },
							{ label: 'Дом', value: selectedDevice.house },
							{ label: 'Широта', value: selectedDevice.latitude },
							{ label: 'Долгота', value: selectedDevice.longitude },
						],
					},
				]
			case 'technician':
				return [
					{
						title: 'Аппарат',
						items: [
							{ label: 'IMEI', value: selectedDevice.imei },
							{ label: 'Серийный номер', value: selectedDevice.serial_number },
							{ label: 'Модель аппарата', value: selectedDevice.device_model },
							{
								label: 'Модель купюроприемника',
								value: selectedDevice.bill_acceptor_model,
							},
							{
								label: 'Модель монетоприемника',
								value: selectedDevice.coin_acceptor_model,
							},
							{
								label: 'Интерфейс пользователя',
								value: selectedDevice.user_interface,
							},
							{
								label: 'Язык интерфейса',
								value: selectedDevice.interface_language,
							},
							{ label: 'Дата создания', value: selectedDevice.creation_date },
						],
					},
					{
						title: 'Датчики',
						items: [
							{ label: 'Температура', value: selectedDevice.temperature },
							{ label: 'ТДС', value: selectedDevice.tds },
						],
					},
					{
						title: 'Счетчики',
						items: [
							{
								label: 'Остаток продукта',
								value: selectedDevice.product_balance,
							},
							{
								label: 'Счетчик воды на входе',
								value: selectedDevice.water_inlet_counter,
							},
							{
								label: 'Счетчик электрической энергии',
								value: selectedDevice.electricity_counter,
							},
						],
					},
					{
						title: 'Связь',
						items: [
							{
								label: 'Тип подключения',
								value: selectedDevice.connection_type,
							},
							{
								label: 'Номер SIM-карты',
								value: selectedDevice.sim_card_number,
							},
							{
								label: 'Оператор связи',
								value: selectedDevice.telecom_operator,
							},
							{ label: 'Уровень сигнала', value: selectedDevice.signal_level },
							{
								label: 'Баланс SIM-карты',
								value: selectedDevice.sim_card_balance,
							},
							{
								label: 'Дата последней активности',
								value: selectedDevice.date_of_last_activity,
							},
						],
					},
					{
						title: 'Продукты',
						items:
							selectedDevice.products && selectedDevice.products.length
								? selectedDevice.products.map(product => ({
										label: `Цена "${product.name}"`,
										value: product.price,
								  }))
								: [{ label: 'Продукты отсутствуют', value: '-' }],
					},
					{
						title: 'Программное обеспечение',
						items: [
							{
								label: 'Версия прошивки главного контроллера',
								value: selectedDevice.main_controller_firmware_version,
							},
							{
								label: 'Версия прошивки контроллера подготовки воды',
								value:
									selectedDevice.water_preapration_controller_firmware_version,
							},
							{
								label: 'Версия прошивки контроллера Дисплея',
								value: selectedDevice.display_controller_firmware_version,
							},
							{
								label: 'Дата прошивки главного контроллера',
								value: selectedDevice.main_controller_firmware_date,
							},
						],
					},
				]
			case 'accountant':
				return []
			default:
				return []
		}
	}

	const infoSections = getInfoSections()

	return (
		<div className='p-4 lg:p-8'>
			<SelectDevice />
			<div className='flex gap-3 flex-nowrap w-full lg:max-w-[748px] xl:max-w-[960px] 2xl:max-w-full'>
				<div className='w-full bg-white rounded-lg shadow p-5 flex flex-col flex-1'>
					<DeviceNavigate />
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{infoSections.map((section, sectionIndex) => (
							<div key={sectionIndex}>
								<h2 className='text-base md:text-xl font-semibold mb-6'>
									{section.title}
								</h2>
								<div className='space-y-4'>
									{section.items?.map((item, itemIndex) => (
										<div key={itemIndex} className='grid grid-cols-2 gap-4'>
											<div className='text-gray-600 text-xs md:text-base'>
												{item.label}
											</div>
											<div className='text-xs md:text-base'>{item.value}</div>
										</div>
									))}
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
				<DeviceSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
			</div>
		</div>
	)
}

export default DeviceDetails
