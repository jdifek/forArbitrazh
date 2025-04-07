import { useEffect, useState } from 'react'
import usePermissions from '../../helpers/hooks/usePermissions'

interface IConcentrationInputProps {
	value: number
	onChange: (newValue: number) => void
}

const ConcentrationInput = ({ value, onChange }: IConcentrationInputProps) => {
	const [localValue, setLocalValue] = useState(value)
	const { canEdit } = usePermissions()

	useEffect(() => {
		setLocalValue(value)
	}, [value])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (canEdit) {
			const newValue = Number(e.target.value)
			if (newValue >= 0 && newValue <= 100) {
				setLocalValue(newValue)
				onChange(newValue)
			}
		}
	}

	const increase = () => {
		const newValue = Math.min(100, localValue + 1)
		setLocalValue(newValue)
		onChange(newValue)
	}

	const decrease = () => {
		const newValue = Math.max(0, localValue - 1)
		setLocalValue(newValue)
		onChange(newValue)
	}

	return (
		<div className='flex items-center gap-3'>
			<label htmlFor='concentration' className='text-gray-700'>
				Концентрація продукту
			</label>
			<div className='flex items-center bg-white border rounded-lg shadow-sm px-2 py-1'>
				<button
					onClick={decrease}
					className='w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-md text-lg font-bold hover:bg-blue-600 transition'
				>
					−
				</button>
				<input
					id='concentration'
					type='number'
					value={localValue}
					onChange={handleChange}
					disabled={!canEdit}
					min='0'
					max='100'
					className='w-14 text-center text-lg font-semibold border-none outline-none bg-transparent'
				/>
				<span className='text-gray-700 mr-2'>%</span>
				<button
					onClick={increase}
					className='w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-md text-lg font-bold hover:bg-blue-600 transition'
				>
					+
				</button>
			</div>
		</div>
	)
}

export default ConcentrationInput
