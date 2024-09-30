'use client'

import { Rating } from '../ui/rating'

interface Props {
	rating: number
	count: number
}
export const ReviewsRating = ({ rating, count }: Props) => {
	return (
		<Rating
			rating={rating}
			totalStars={5}
			size={32}
			variant='yellow'
			className='flex flex-col justify-center items-end'
			showText={true}
			disabled={true}
			totalReviews={count}
		/>
	)
}
