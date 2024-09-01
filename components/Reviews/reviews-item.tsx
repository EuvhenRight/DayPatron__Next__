import { CurrentUser } from '@/lib/hooks/currentUser'
import { ProductsWithVariantsWithReviews } from '@/lib/types/types'
import { ReviewItem } from '@prisma/client'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale' // Import your preferred locale
import { ShieldCheck } from 'lucide-react'
import { User } from 'next-auth'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Rating } from '../ui/rating'
import { DeleteButtonMessage } from './delete-button-message'
import { EditButtonMessage } from './edit-button-message'

interface Props {
	message: ReviewItem
	product: ProductsWithVariantsWithReviews
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
	setCurrentItem: React.Dispatch<React.SetStateAction<string>>
}

export const ReviewsItem = ({
	message,
	product,
	setEdit,
	setCurrentItem,
}: Props) => {
	const name = message.fullName.charAt(0)
	const user = CurrentUser() as User | null
	const formattedDate = format(new Date(message.createdAt), 'dd.MM.yyyy', {
		locale: enUS,
	})

	return (
		<div className='flex flex-col gap-4 my-4 border-b-2 border-neutral-200 pb-4 px-2'>
			<div className='flex flex-col gap-2'>
				<div className='flex gap-2 relative justify-between'>
					<div className='flex gap-2'>
						{/* AVATAR */}
						<Avatar className='w-12 h-12'>
							<AvatarFallback className='bg-neutral-800 text-white'>
								{name}
							</AvatarFallback>
						</Avatar>
						{/* VERIFIED */}
						{message.verified && (
							<span className='absolute top-0 -left-5'>
								<ShieldCheck size={20} className='text-green-500' />
							</span>
						)}
						<div className='flex flex-col'>
							<div className='flex gap-2'>
								<p className='text-sm font-extrabold'>{message.fullName}</p>
								{message.verified && (
									<p className='text-sm text-green-500'>Перевірений</p>
								)}
							</div>
							{/* RATING */}
							<Rating
								rating={message.rating}
								totalStars={5}
								size={16}
								variant='yellow'
								showText={false}
								disabled={true}
							/>
						</div>
					</div>
					{/* DATE */}
					<div className='flex flex-col justify-between items-end'>
						<p className='text-[12px]'>{formattedDate}</p>
						{message.email === user?.email && (
							<div className='flex w-full justify-between gap-2'>
								{/* EDIT MESSAGE */}
								<EditButtonMessage
									message={message}
									setEdit={setEdit}
									product={product}
									setCurrentItem={setCurrentItem}
								/>
								{/* DELETE MESSAGE */}
								<DeleteButtonMessage message={message} product={product} />
							</div>
						)}
					</div>
				</div>
				{/* MESSAGE */}
				<p className='text-sm ml-14 py-4 break-words'>{message.message}</p>
			</div>
		</div>
	)
}
