import { ReviewsWithItems } from '@/lib/types/types'
import { Tooltip } from '@radix-ui/react-tooltip'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

export const EditButtonMessage = () => {
	const handleEdit = async () => {
		try {
			// DELETE REVIEW

			const deleteItemToast = new Promise<ReviewsWithItems>(resolve => {
				resolve(editItem(product.id, message.email))
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
