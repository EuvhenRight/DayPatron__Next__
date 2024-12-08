'use client'
import { ReviewsNewMessageButton } from '@/components/Reviews/reviews-new-message-button'
import { ReviewsRating } from '@/components/Reviews/reviews-rating'
import { cn } from '@/lib/utils/utils'
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
}: Props) => {
	return (
		<div className='w-full' id='reviews'>
			<div
				className={cn(
					'flex justify-between items-center border-b-2 border-gray-200 flex-col sm:flex-row sm:mx-2 *:my-4'
				)}
			>
				<div className='sm:ml-10'>
					<ReviewsRating rating={reviewsRating} count={reviewsCount} />
				</div>
				{/* CLOSE BUTTON CONDITION */}
				<div>
					{!edit && !open && (
						<ReviewsNewMessageButton
							labelOpen={labelOpen}
							open={open}
							setOpen={setOpen}
							labelClose={labelClose}
							edit={edit}
						/>
					)}
				</div>
			</div>
			{children}
		</div>
	)
}
