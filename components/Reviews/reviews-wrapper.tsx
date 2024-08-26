'use client'
import { ReviewsCount } from '@/components/Reviews/reviews-count'
import { ReviewsNewMessageButton } from '@/components/Reviews/reviews-new-message-button'
import { ReviewsRating } from '@/components/Reviews/reviews-rating'
import React from 'react'

interface Props {
	children: React.ReactNode
	reviewsCount: number
	reviewsRating: number
	messageButton: string
}
export const ReviewsWrapper = ({
	children,
	reviewsCount,
	reviewsRating,
	messageButton,
}: Props) => {
	return (
		<div className='w-full'>
			<div>
				<ReviewsCount count={reviewsCount} />
				<ReviewsRating rating={reviewsRating} />
				<ReviewsNewMessageButton label={messageButton} />
			</div>
			{children}
		</div>
	)
}
