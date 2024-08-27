import { ReviewItem } from '@prisma/client'
import { ShieldCheck } from 'lucide-react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Rating } from '../ui/rating'

interface Props {
	message: ReviewItem
}
export const ReviewsItem = ({ message }: Props) => {
	const name = message.fullName.charAt(0)
	return (
		<div className='flex flex-col gap-4 my-4'>
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
					<p className='text-sm'>
						{message.createdAt.toLocaleDateString('uk-UA', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})}
					</p>
				</div>
				{/* MESSAGE */}
				<p className='text-sm ml-14'>{message.message}</p>
			</div>
		</div>
	)
}
