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
import { ReviewsPage } from './reviewsPage'
interface Props {
	reviews: ReviewsWithItems
	product: ProductsWithVariantsWithReviews
}
export const ReviewsComponent = ({ reviews, product }: Props) => {
	const [open, setOpen] = useState(false)
	const [edit, setEdit] = useState(false)
	// MESSAGE ID FOR EDIT
	const [currentItem, setCurrentItem] = useState<string>('')

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
				{/* OPEN FORM REVIEW */}
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5, ease: 'easeInOut' }}
						className='my-5 px-4'
					>
						<ReviewsForm
							product={product}
							setOpen={setOpen}
							setEdit={setEdit}
						/>
					</motion.div>
				)}
				{/* EDIT FORM REVIEW */}
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
							setOpen={setOpen}
							currentItem={currentItem}
						/>
					</motion.div>
				)}
				{/* ADD BORDER TO OPEN FORM REVIEW */}
				<div
					className={cn(
						open || edit ? 'border-t-2 border-gray-200' : '',
						'p-4'
					)}
				>
					<ReviewsPage
						reviewsFromPage={reviews}
						pageTotal={reviews?.pageTotal}
						product={product}
						setEdit={setEdit}
						setCurrentItem={setCurrentItem}
					/>
				</div>
			</>
		</ReviewsWrapper>
	)
}
