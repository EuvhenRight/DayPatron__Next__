import { deleteItem } from '@/actions/reviews'
import {
	ProductsWithVariantsWithReviews,
	ReviewsWithItems,
} from '@/lib/types/types'
import { ReviewItem } from '@prisma/client'
import { Tooltip } from '@radix-ui/react-tooltip'
import { SquareX } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface Props {
	message: ReviewItem
	product: ProductsWithVariantsWithReviews
}
export const DeleteButtonMessage = ({ message, product }: Props) => {
	// TODO: Fix mobile layout
	const handleDelete = async () => {
		try {
			// DELETE REVIEW
			const deleteItemToast = new Promise<ReviewsWithItems>(resolve => {
				resolve(deleteItem(product.id, message.id))
			})
			// UPDATE DELIVERY
			await toast.promise(deleteItemToast, {
				loading: 'Зачекаємо...',
				success: 'Ваш відгук видалено!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='destructive'
						onClick={handleDelete}
						className='p-0 h-6 w-6 border-none'
					>
						<SquareX size={28} />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Видалити відгук</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
