import { ProductsWithVariantsWithReviews } from '@/lib/types/types'
import { ReviewItem } from '@prisma/client'
import { Tooltip } from '@radix-ui/react-tooltip'
import { Pencil } from 'lucide-react'
import { Button } from '../ui/button'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface Props {
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
	message: ReviewItem
	product: ProductsWithVariantsWithReviews
}
export const EditButtonMessage = ({ setEdit, message, product }: Props) => {
	const handleEdit = () => {}
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='ghost'
						onClick={handleEdit}
						className='p-0 h-6 w-6 text-green-500 hover:text-neutral-800'
					>
						<Pencil size={28} />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Редагувати відгук</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}