'use server'
import prisma from '@/lib/db/client'
import { ValidationSchema } from '@/lib/db/validation'
import { getReviewsWithItem } from '@/lib/services/reviews'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function addItem(
	productId: string,
	data: z.infer<typeof ValidationSchema.reviews>,
	userId?: string
) {
	// FIND EXISTING REVIEW
	const reviews = await getReviewsWithItem(productId)

	if (!reviews) {
		throw new Error('Reviews not found')
	}
	// // FIND EXISTING CART ITEM
	// const findItem = reviews.messages.find(item => item.userId === userId)

	// // UPDATE CART ITEM
	// if (findItem) {
	// 	await prisma?.reviewItem.update({
	// 		where: { id: findItem.id },
	// 		data: { ...data },
	// 	})
	// } else { // CREATE NEW CART ITEM TODO: implement this login to update message
	await prisma?.reviewItem.create({
		data: {
			message: data.message,
			email: data.email,
			fullName: data.fullName,
			rating: data.rating,
			verified: true,
			reviewsId: reviews.id,
			userId: userId!,
		},
	})

	// UPDATE REVIEW
	const updateReviews = await getReviewsWithItem(productId)

	// RECALCULATE TOTALS
	await prisma.$transaction(async tx => {
		// CALCULATE TOTAL RATING AND NUMBER OF RATINGS
		const totalItems = updateReviews.messages.length
		const totalRatings = updateReviews.messages.reduce(
			(acc, item) => acc + item.rating,
			0
		)
		const numberOfRatings = updateReviews.messages.length
		// CALCULATE AVERAGE RATING
		const averageRating =
			numberOfRatings > 0
				? parseFloat((totalRatings / numberOfRatings).toFixed(1)) // NUMBER OF RATINGS
				: 0

		await tx.reviews.update({
			where: { id: reviews.id },
			data: {
				messageTotal: totalItems,
				ratingTotal: averageRating,
			},
		})
	})

	// ADD TYPE REVALIDATE CACHE
	revalidatePath('/product/[slug]/details', 'page')

	return { ...reviews }
}
// // Re-fetch the cart to get the updated version
// const updatedCart = await getCart()

// // RECALCULATE TOTALS
// const totalPrice = updatedCart?.items.reduce((acc, item) => {
// 	const price =
// 		item.variant.discount_price !== 0
// 			? item.variant.discount_price
// 			: item.variant.original_price
// 	return acc + price * item.quantity
// }, 0)
