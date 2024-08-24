import prisma from '@/lib/db/client'
import { Reviews } from '@prisma/client'

export async function createReview(productId: string): Promise<Reviews> {
	// Step 1: CREATE THE REVIEW
	const reviews = await prisma.reviews.create({
		data: {
			messageTotal: 0,
			ratingTotal: 0,
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
