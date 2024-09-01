'use client'
import {
	ProductsWithVariantsWithReviews,
	ReviewsWithItems,
} from '@/lib/types/types'
import React, { useEffect, useState } from 'react'
import { PaginationComponent } from './pagination-c'
import { ReviewsItem } from './reviews-item'

interface Props {
	pageTotal: number
	product: ProductsWithVariantsWithReviews
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
	setCurrentItem: React.Dispatch<React.SetStateAction<string>>
	reviewsFromPage: ReviewsWithItems
}

export const ReviewsPage = ({
	product,
	setEdit,
	setCurrentItem,
	pageTotal,
	reviewsFromPage,
}: Props) => {
	const [reviews, setReviews] = useState<ReviewsWithItems | null>(null)
	const [page, setPage] = useState<number>(1)
	const [pageSize, setPageSize] = useState<number>(5)

	// LOGIC FOR PAGINATION PAGES
	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const response = await fetch(
					`/api/reviews?productId=${product.id}&page=${page}&pageSize=${pageSize}`,
					{ next: { revalidate: 10 } }
				)
				const data = await response.json()

				return setReviews(data)
			} catch (error) {
				console.error('Failed to fetch reviews:', error)
			}
		}

		fetchReviews()
	}, [product.id, page, pageSize])

	return (
		<>
			{/* IF THERE ARE NO REVIEWS */}
			{reviewsFromPage?.messages.length === 0 ? (
				<div className='text-center text-neutral-500'>
					Немає відгуків, будьте першим
				</div>
			) : (
				<>
					{/* IF THERE ARE REVIEWS ONLY ON FIRST PAGE */}
					{page === 1 ? (
						<ul>
							{reviewsFromPage?.messages.map(message => (
								<li key={message.id}>
									<ReviewsItem
										message={message}
										product={product}
										setEdit={setEdit}
										setCurrentItem={setCurrentItem}
									/>
								</li>
							))}
						</ul>
					) : (
						// IF THERE ARE REVIEWS ON OTHER PAGES
						<ul>
							{reviews?.messages.map(message => (
								<li key={message.id}>
									<ReviewsItem
										message={message}
										product={product}
										setEdit={setEdit}
										setCurrentItem={setCurrentItem}
									/>
								</li>
							))}
						</ul>
					)}
					<PaginationComponent
						pageTotal={pageTotal}
						setPage={setPage}
						page={page}
					/>
				</>
			)}
		</>
	)
}
