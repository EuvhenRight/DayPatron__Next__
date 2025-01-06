'use client'
import { Button } from '../ui/button'

interface Props {
	label: string
	handleClose: () => void
}

export const BackButton = ({ label, handleClose }: Props) => {
	return (
		<Button
			variant='link'
			onClick={handleClose}
			className='w-full text-center text-gray-400 font-light hover:underline py-5 cursor-pointer'
		>
			{label}
		</Button>
	)
}
