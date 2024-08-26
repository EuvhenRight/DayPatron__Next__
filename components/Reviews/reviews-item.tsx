import { ReviewItem } from '@prisma/client'
import { Rating } from '../ui/rating'

interface Props {
	message: ReviewItem
}
export const ReviewsItem = ({ message }: Props) => {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-2'>
				<h3>{message.email}</h3>
				<span>
					<Rating
						rating={message.rating}
						totalStars={5}
						size={32}
						variant='yellow'
						className='h-1 my-4'
						showText={false}
						disabled={true}
					/>
				</span>
				<span>{message.verified && 'Verified'}</span>
				{/* TODO: ADD DATE */}
				<span>{message.createdAt.getDate()}</span>
				<h3>{message.fullName}</h3>
				<h3>{message.message}</h3>
			</div>
		</div>
	)
}
