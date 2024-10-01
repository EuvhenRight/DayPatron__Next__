'use server'
import prisma from '@/lib/db/client'
import { ValidationSchema } from '@/lib/db/validation'
import { createReviewEmailHtml } from '@/lib/services/e-mail-new-user'
import { sendEmail } from '@/lib/services/mail-password'
import { findProductsInOrderItems } from '@/lib/services/order'
import { getReviewsWithItem } from '@/lib/services/reviews'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function addItem(
	productId: string,
	data: z.infer<typeof ValidationSchema.reviews>,
	userId?: string
) {
	try {
		// FIND EXISTING REVIEW
		const reviews = await getReviewsWithItem(productId, 1)

		if (!reviews) {
			throw new Error('Reviews not found')
		}

		// CHECK VERIFIED USER
		const verifiedOrders = await findProductsInOrderItems(userId!, productId)

		// CREATE REVIEW ITEM
		await prisma?.reviewItem.create({
			data: {
				message: data.message,
				email: data.email,
				fullName: data.fullName,
				rating: data.rating,
				verified: verifiedOrders?.length ?? 0 > 0 ? true : false,
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
		const updateReviews = await getReviewsWithItem(productId, 1)

		// RECALCULATE TOTALS
		await prisma.$transaction(async tx => {
			// CALCULATE TOTAL RATING AND NUMBER OF RATINGS
			const totalItems = await prisma.reviewItem.count({
				where: { reviewsId: updateReviews?.id },
			})
			const totalRatings = await prisma.reviewItem.aggregate({
				where: { reviewsId: updateReviews?.id },
				_sum: { rating: true },
			})
			const totalRatingsSum = totalRatings._sum.rating || 0
			const numberOfRatings = totalItems
			// CALCULATE AVERAGE RATING
			const averageRating =
				numberOfRatings > 0
					? parseFloat((totalRatingsSum / numberOfRatings).toFixed(1))
					: 0

			// TRANSACT REVIEWS PAGE'S
			const totalPages = Math.ceil(totalItems / 5)

			await tx.reviews.update({
				where: { id: updateReviews?.id },
				data: {
					messageTotal: totalItems,
					ratingTotal: averageRating,
					pageTotal: totalPages,
				},
			})
		})

		// ADD TYPE REVALIDATE CACHE
		revalidatePath('/product/[slug]/details', 'layout')

		return { ...reviews }
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error(
			'Помилка додавання відгуку, зверніться до cервісу підтримки'
		)
	}
}

export async function deleteItem(productId: string, itemId: string) {
	try {
		const reviews = await getReviewsWithItem(productId, 1)

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
		const updateReviews = await getReviewsWithItem(productId, 1)

		// RECALCULATE TOTALS
		await prisma.$transaction(async tx => {
			// CALCULATE TOTAL RATING AND NUMBER OF RATINGS
			const totalItems = await prisma.reviewItem.count({
				where: { reviewsId: updateReviews?.id },
			})
			const totalRatings = await prisma.reviewItem.aggregate({
				where: { reviewsId: updateReviews?.id },
				_sum: { rating: true },
			})
			const totalRatingsSum = totalRatings._sum.rating || 0
			const numberOfRatings = totalItems
			// CALCULATE AVERAGE RATING
			const averageRating =
				numberOfRatings > 0
					? parseFloat((totalRatingsSum / numberOfRatings).toFixed(1))
					: 0

			// TRANSACT REVIEWS PAGE'S
			const totalPages = Math.ceil(totalItems / 5)

			await tx.reviews.update({
				where: { id: updateReviews?.id },
				data: {
					messageTotal: totalItems,
					ratingTotal: averageRating,
					pageTotal: totalPages,
				},
			})
		})

		// ADD TYPE REVALIDATE CACHE
		revalidatePath('/product/[slug]/details', 'layout')

		return { ...reviews }
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error(
			'Помилка видалення відгуку, зверніться до cервісу підтримки'
		)
	}
}
// EDIT REVIEW
export async function editItem(
	productId: string,
	newData: z.infer<typeof ValidationSchema.reviews>,
	messageId: string
) {
	try {
		const reviews = await getReviewsWithItem(productId as string, 1)

		if (!reviews) {
			throw new Error('Reviews not found')
		}

		// FIND EXISTING REVIEW ITEM
		const findItem = reviews.messages.find(item => item.id === messageId)

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
		const updateReviews = await getReviewsWithItem(productId, 1)

		// RECALCULATE TOTALS
		await prisma.$transaction(async tx => {
			// CALCULATE TOTAL RATING AND NUMBER OF RATINGS
			const totalItems = await prisma.reviewItem.count({
				where: { reviewsId: updateReviews?.id },
			})
			const totalRatings = await prisma.reviewItem.aggregate({
				where: { reviewsId: updateReviews?.id },
				_sum: { rating: true },
			})
			const totalRatingsSum = totalRatings._sum.rating || 0
			const numberOfRatings = totalItems
			// CALCULATE AVERAGE RATING
			const averageRating =
				numberOfRatings > 0
					? parseFloat((totalRatingsSum / numberOfRatings).toFixed(1))
					: 0

			// TRANSACT REVIEWS PAGE'S
			const totalPages = Math.ceil(totalItems / 5)

			await tx.reviews.update({
				where: { id: updateReviews?.id },
				data: {
					messageTotal: totalItems,
					ratingTotal: averageRating,
					pageTotal: totalPages,
				},
			})
		})

		// ADD TYPE REVALIDATE CACHE
		revalidatePath('/product/[slug]/details', 'layout')

		return { ...reviews }
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error(
			'Помилка редагування відгуку, зверніться до cервісу підтримки'
		)
	}
}
