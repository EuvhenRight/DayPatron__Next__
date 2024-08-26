'use client'
import { ReviewsWrapper } from '@/components/Reviews/reviews-wrapper'
import {
	ProductsWithVariantsWithReviews,
	ReviewsWithItems,
} from '@/lib/types/types'
import { ReviewsForm } from './reviews-form'
import { ReviewsItem } from './reviews-item'

interface Props {
	reviews: ReviewsWithItems
	product: ProductsWithVariantsWithReviews
}
export const ReviewsComponent = ({ reviews, product }: Props) => {
	return (
		<ReviewsWrapper
			reviewsCount={reviews?.messageTotal}
			reviewsRating={reviews?.ratingTotal}
			messageButton='Написати відгук'
		>
			<>
				{reviews?.messages.map(message => (
					<ReviewsItem key={message.id} message={message} />
				))}
				<div>
					<ReviewsForm reviews={reviews} product={product} />
				</div>
			</>
		</ReviewsWrapper>
	)
}
