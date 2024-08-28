'use client'
import { cn } from '@/lib/utils/utils'
import { Pencil, SquareX } from 'lucide-react'
import { Button } from '../ui/button'

interface Props {
	labelOpen: string
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	labelClose: string
}
export const ReviewsNewMessageButton = ({
	labelOpen,
	open,
	setOpen,
	labelClose,
}: Props) => {
	const toggleOpenButton = () => {
		setOpen(!open)
	}
	return (
		<Button
			variant='outline'
			onClick={toggleOpenButton}
			size='sm'
			// CHANGE COLOR WHEN OPEN OR CLOSE
			className={cn(
				open
					? 'text-red-600 border border-red-600'
					: 'text-green-600 border border-green-600',
				'shadow-lg gap-2 hover:scale-105 transition-all ease-in-out duration-300 font-bold mr-10'
			)}
		>
			{/* CHANGE ICON WHEN OPEN OR CLOSE */}
			{open ? (
				<>
					<SquareX size={16} /> {labelClose}
				</>
			) : (
				<>
					<Pencil size={18} /> {labelOpen}
				</>
			)}
		</Button>
	)
}