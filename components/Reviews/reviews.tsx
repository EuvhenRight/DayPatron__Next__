'use client'
import { ReviewsWrapper } from '@/components/Reviews/reviews-wrapper'

export const Reviews = () => {
	return (
		<ReviewsWrapper
			reviewsCount={10}
			reviewsRating={10}
			messageButton='Написати відгук'
		>
			<>
				<p>Reviews</p>
			</>
		</ReviewsWrapper>
	)
}
