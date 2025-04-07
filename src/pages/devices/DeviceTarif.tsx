import { SelectDevice } from '../../components/Device/SelectDevice'
import { DeviceNavigate } from '../../components/Device/Navigate'
import { DeviceSidebar } from '../../components/Device/DeviceSidebar'
import { ButtonSave } from '../../components/ui/Button'
import { BillAcceptorModels, CoinAcceptorModels } from '../../data/model'
import useSidebar from '../../helpers/hooks/useSidebar'
import { IoSettingsSharp } from 'react-icons/io5'

export const DeviceTarif = () => {
	const { isSidebarOpen, setIsSidebarOpen } = useSidebar()

	return (
		<div className='p-4 lg:p-8'>
			<SelectDevice />

			<div className='flex gap-3 flex-nowrap w-full lg:max-w-[748px] xl:max-w-[960px] 2xl:max-w-full'>
				<div className='w-full bg-white rounded-lg shadow p-5 flex flex-col flex-1'>
					<DeviceNavigate />

					<div className='p-4 lg:p-8'>
						<div className='bg-white rounded-lg shadow p-6'>
							<div className='space-y-6'>
								<div className='flex gap-5 items-center'>
									<label className='block text-sm font-medium text-gray-700'>
										Модель купюроприемника
									</label>
									<div className='mt-1 flex rounded-md shadow-sm'>
										<select
											className='block w-full rounded-md border-gray-300 shadow-sm'
											defaultValue={BillAcceptorModels.FSKJSD} // Значение по умолчанию
										>
											{Object.values(BillAcceptorModels).map(model => (
												<option key={model} value={model}>
													{model}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className='flex gap-5 items-center'>
									<label className='block text-sm font-medium text-gray-700'>
										Модель монетоприемника
									</label>
									<div className='mt-1 flex rounded-md shadow-sm'>
										<select
											className='block w-full rounded-md border-gray-300 shadow-sm'
											defaultValue={CoinAcceptorModels.MICROCOIN_SP} // Значение по умолчанию
										>
											{Object.values(CoinAcceptorModels).map(model => (
												<option key={model} value={model}>
													{model}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className='flex gap-5 items-center'>
									<label className='block text-sm font-medium text-gray-700'>
										Чуствительность датчика вибрации
									</label>
									<div className='mt-1 flex rounded-md shadow-sm'>
										<input
											type='number'
											className='block w-full rounded-md border-gray-300 shadow-sm'
											defaultValue='54'
										/>
									</div>
								</div>

								<ButtonSave />
							</div>
						</div>
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
