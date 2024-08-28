'use client'
import { ReviewsNewMessageButton } from '@/components/Reviews/reviews-new-message-button'
import { ReviewsRating } from '@/components/Reviews/reviews-rating'
import React from 'react'

interface Props {
	children: React.ReactNode
	reviewsCount: number
	reviewsRating: number
	labelOpen: string
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	labelClose: string
	edit: boolean
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
}
export const ReviewsWrapper = ({
	children,
	reviewsCount,
	reviewsRating,
	labelOpen,
	open,
	setOpen,
	labelClose,
	edit,
	setEdit,
}: Props) => {
	return (
		<div className='w-full'>
			<div className='flex justify-between items-center border-b-2 border-gray-200 flex-col sm:flex-row'>
				<div className='my-4 ml-10'>
					<ReviewsRating rating={reviewsRating} count={reviewsCount} />
				</div>
				<ReviewsNewMessageButton
					labelOpen={labelOpen}
					open={open}
					setOpen={setOpen}
					labelClose={labelClose}
					edit={edit}
					setEdit={setEdit}
				/>
			</div>
			{children}
		</div>
	)
}
