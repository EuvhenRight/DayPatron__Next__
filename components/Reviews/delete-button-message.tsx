import { deleteItem } from '@/actions/reviews'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	ProductsWithVariantsWithReviews,
	ReviewsWithItems,
} from '@/lib/types/types'
import { ReviewItem } from '@prisma/client'
import { SquareX } from 'lucide-react'
import { toast } from 'sonner'

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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='destructive' className='p-0 h-6 w-6 border-none'>
					<SquareX size={28} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-40'>
				<DropdownMenuLabel className='text-center'>
					Видалити відгук?
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleDelete}>Так</DropdownMenuItem>
					<DropdownMenuItem>Ні</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
