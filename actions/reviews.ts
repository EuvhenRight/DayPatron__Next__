'use server'
import prisma from '@/lib/db/client'
import { ValidationSchema } from '@/lib/db/validation'
import { createReviewEmailHtml } from '@/lib/services/e-mail-new-user'
import { sendEmail } from '@/lib/services/mail-password'
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

	// CREATE REVIEW ITEM
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
	const checkUser = await prisma?.user.findUnique({
		where: {
			email: data.email,
		},
	})
	// SEND EMAIL IF USER DOES NOT EXIST
	if (!checkUser) {
		await sendEmail({
			to: ['eu@gembird.nl', `${data.email}`],
			subject: `Дякуємо ${data.fullName}, за відгук на сайті DayPatron`,
			text: `© 2023 DayPatron Inc. Усі права захищені`,
			html: createReviewEmailHtml({ message: data }),
		})
	}

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

export async function deleteItem(productId: string, itemId: string) {
	const reviews = await getReviewsWithItem(productId)

	if (!reviews) {
		throw new Error('Reviews not found')
	}
	// FIND EXISTING REVIEW ITEM
	const findItem = reviews.messages.find(item => item.id === itemId)

	if (!findItem) {
		throw new Error('Cart item not found')
	}

	await prisma?.reviewItem.delete({
		where: { id: findItem.id },
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
// EDIT REVIEW
export async function editItem(
	productId: string,
	newData: z.infer<typeof ValidationSchema.reviews>,
	userEmail: string
) {
	const reviews = await getReviewsWithItem(productId)

	if (!reviews) {
		throw new Error('Reviews not found')
	}

	// FIND EXISTING REVIEW ITEM
	const findItem = reviews.messages.find(item => item.email === userEmail)

	if (!findItem) {
		throw new Error('Review item not found')
	}

	await prisma?.reviewItem.update({
		where: { id: findItem.id },
		data: {
			fullName: newData.fullName,
			rating: newData.rating,
			message: newData.message,
			email: findItem.email,
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
