'use client'
import { cn } from '@/lib/utils/utils'
import { Pencil } from 'lucide-react'
import { Button } from '../ui/button'

interface Props {
	labelOpen: string
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	labelClose: string
	edit: boolean
}
export const ReviewsNewMessageButton = ({
	labelOpen,
	open,
	setOpen,
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
				'text-green-600 border border-green-600',
				'shadow-lg gap-2 hover:scale-105 transition-all ease-in-out duration-300 font-bold sm:mr-10'
			)}
		>
			<Pencil size={18} /> {labelOpen}
		</Button>
	)
}
