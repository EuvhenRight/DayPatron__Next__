import prisma from '@/lib/db/client'
import { Reviews } from '@prisma/client'
import { ReviewsWithItems } from '../types/types'

export async function createReview(productId: string): Promise<Reviews> {
	// Step 1: CREATE THE REVIEW
	const reviews = await prisma.reviews.create({
		data: {
			messageTotal: 0,
			ratingTotal: 0,
			pageTotal: 1,
			messages: { create: [] }, // CREATE THE MESSAGES ARRAY IN THE REVIEW
		},
	})

	// STEP 2: UPDATE THE PRODUCT
	await prisma.product.update({
		where: { id: productId },
		data: { reviewsId: reviews.id },
	})

	return reviews
}
export async function getReviewsWithItem(
	productId: string,
	currentPage: number
): Promise<ReviewsWithItems | null> {
	// SETUP PAGE SIZE
	const pageSize = 5
	const page = currentPage

	const skip = (page - 1) * pageSize

	// Ensure pageSize is valid
	if (pageSize <= 0) {
		throw new Error('pageSize must be greater than 0')
	}

	// Fetch the product to get the reviewsId
	const product = await prisma.product.findUnique({
		where: { id: productId },
		include: { reviews: true },
	})

	if (!product || !product.reviewsId) {
		throw new Error('Product not found or has no reviews')
	}

	// Fetch reviews with paginated messages
	const reviews = await prisma.reviews.findUnique({
		where: { id: product.reviewsId },
		include: {
			messages: {
				orderBy: { updatedAt: 'desc' },
				skip: skip,
				take: pageSize,
			},
		},
	})
	return reviews
}
