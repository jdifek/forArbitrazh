import 'react-datepicker/dist/react-datepicker.css'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { formatDate } from '../../helpers/function/formateDate'
import { SaleTableData } from '../../types'

interface StatisticsTableProps {
	paginatedData: SaleTableData[]
	totalCost: number
	totalIssued: number
	totalOrdered: number
	data: SaleTableData[]
	sortState: {
		column: string | null
		order: 'asc' | 'desc' | null
	}
	setSortState: React.Dispatch<
		React.SetStateAction<{
			column: string | null
			order: 'asc' | 'desc' | null
		}>
	>
}

const StatisticsTable = ({
	paginatedData,
	totalCost,
	totalIssued,
	totalOrdered,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	data,
	sortState,
	setSortState,
}: StatisticsTableProps) => {
	const handleSort = (column: keyof (typeof data)[0]) => {
		setSortState(prev => ({
			column,
			order: prev.column === column && prev.order === 'asc' ? 'desc' : 'asc',
		}))
	}

	return (
		<div className='overflow-x-auto w-full mx-auto sm:max-w-[640px] md:max-w-full lg:max-w-[700px] max-w-3lg max-w-2lg xl:max-w-full 2xl:max-w-full'>
			<table className='w-full border-collapse text-left'>
				<thead>
					<tr>
						{[
							'id',
							'date',
							'cost',
							'issued',
							'ordered',
							'product',
							'payment',
							'store',
						].map(key => (
							<th
								key={key}
								className='p-3 cursor-pointer'
								onClick={() => handleSort(key as keyof (typeof data)[0])}
							>
								<div className='flex items-center gap-2 text-base font-medium'>
									{key === 'id'
										? 'Id'
										: key === 'date'
										? 'Дата'
										: key === 'cost'
										? 'Стоимость'
										: key === 'issued'
										? 'Выдано'
										: key === 'ordered'
										? 'Заказано'
										: key === 'product'
										? 'Товар'
										: key === 'payment'
										? 'Тип оплаты'
										: 'Торговая точка'}
									<div className='flex flex-col'>
										<FiChevronUp
											size={14}
											className={
												sortState.column === key && sortState.order === 'asc'
													? 'text-blue-500'
													: 'text-gray-400'
											}
										/>
										<FiChevronDown
											size={14}
											className={
												sortState.column === key && sortState.order === 'desc'
													? 'text-blue-500'
													: 'text-gray-400'
											}
										/>
									</div>
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr className='font-medium text-base'>
						<td className='p-3'>Сумма:</td>
						<td></td>
						<td className='p-3'>{totalCost.toFixed(1)}</td>
						<td className='p-3'>{totalIssued.toFixed(1)}</td>
						<td className='p-3'>{totalOrdered.toFixed(1)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					{paginatedData.length > 0 ? (
						paginatedData.map(row => (
							<tr
								key={row.id}
								className='border-b hover:bg-gray-100 text-[12px]'
							>
								<td className='p-3'>{row.id}</td>
								<td className='p-3'>{formatDate(row.date)}</td>
								<td className='p-3'>{row.cost}</td>
								<td className='p-3'>{row.issued}</td>
								<td className='p-3'>{row.ordered}</td>
								<td className='p-3'>{row.product}</td>
								<td className='p-3'>{row.payment}</td>
								<td className='p-3'>{row.store}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={8} className='p-3 text-center text-gray-500'>
								Ничего не найдено
							</td>
						</tr>
					)}
				</tbody>
				<tfoot>
					<tr>
						{[
							'id',
							'date',
							'cost',
							'issued',
							'ordered',
							'product',
							'payment',
							'store',
						].map(key => (
							<th
								key={key}
								className='p-3 cursor-pointer'
								onClick={() => handleSort(key as keyof (typeof data)[0])}
							>
								<div className='flex items-center gap-2 text-[12px] font-bold'>
									{key === 'id'
										? 'Id'
										: key === 'date'
										? 'Дата'
										: key === 'cost'
										? 'Стоимость'
										: key === 'issued'
										? 'Выдано'
										: key === 'ordered'
										? 'Заказано'
										: key === 'product'
										? 'Товар'
										: key === 'payment'
										? 'Тип оплаты'
										: 'Торговая точка'}
								</div>
							</th>
						))}
					</tr>
				</tfoot>
			</table>
		</div>
	)
}

export default StatisticsTable
