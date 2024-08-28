'use client'
import { ReviewsWrapper } from '@/components/Reviews/reviews-wrapper'
import {
	ProductsWithVariantsWithReviews,
	ReviewsWithItems,
} from '@/lib/types/types'
import { cn } from '@/lib/utils/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ReviewsEditForm } from './reviews-edit-form'
import { ReviewsForm } from './reviews-form'
import { ReviewsItem } from './reviews-item'
interface Props {
	reviews: ReviewsWithItems
	product: ProductsWithVariantsWithReviews
}
export const ReviewsComponent = ({ reviews, product }: Props) => {
	const [open, setOpen] = useState(false)
	const [edit, setEdit] = useState(false)

	return (
		<ReviewsWrapper
			reviewsCount={reviews?.messageTotal}
			reviewsRating={reviews?.ratingTotal}
			labelOpen='Написати відгук'
			open={open}
			setOpen={setOpen}
			labelClose='Закрити'
			edit={edit}
			setEdit={setEdit}
		>
			<>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5, ease: 'easeInOut' }}
						className='my-5 px-4'
					>
						<ReviewsForm
							reviews={reviews}
							product={product}
							setOpen={setOpen}
						/>
					</motion.div>
				)}
				{edit && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5, ease: 'easeInOut' }}
						className='my-5 px-4'
					>
						<ReviewsEditForm
							reviews={reviews}
							product={product}
							setEdit={setEdit}
						/>
					</motion.div>
				)}
				<div className={cn(open && 'border-t-2 border-gray-200', 'p-4')}>
					{reviews.messages.length === 0 && (
						<div className='text-center text-neutral-500'>
							Немає відгуків, будьте першим
						</div>
					)}
					{reviews?.messages.map(message => (
						<ReviewsItem
							key={message.id}
							message={message}
							product={product}
							setEdit={setEdit}
						/>
					))}
				</div>
			</>
		</ReviewsWrapper>
	)
}
