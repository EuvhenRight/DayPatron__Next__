import { getReviewsWithItem } from '@/lib/services/reviews'
import { NextRequest, NextResponse } from 'next/server'

// import prisma from '@/lib/prisma'
// import { Reviews } from '@prisma/client'

// export async function createReview(productId: string): Promise<Reviews> {
// 	// Step 1: CREATE THE REVIEW
// 	const reviews = await prisma.reviews.create({
// 		data: {
// 			messageTotal: 0,
// 			ratingTotal: 0,
// 			messages: { create: [] }, // CREATE THE MESSAGES ARRAY IN THE REVIEW
// 		},
// 	})
// 	// STEP 2: UPDATE THE PRODUCT
// 	await prisma.product.update({
// 		where: { id: productId },
// 		data: { reviewsId: reviews.id },
// 	})
// 	return reviews
// // }
// export async function POST(request: NextRequest) {
// 	const data = await request.json()
// 	console.log(data, 'data')
// 	try {
// 		const review = await createReview(data.productId)
// 		return NextResponse.json(review)
// 	} catch (error) {
// 		return NextResponse.json(
// 			{ error: (error as Error).message },
// 			{ status: 500 }
// 		)
// 	}
// }

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const productId = searchParams.get('productId')
	const page = searchParams.get('page')
	const pageSize = searchParams.get('pageSize')

	if (!productId || typeof productId !== 'string') {
		return NextResponse.json(
			{ error: 'Invalid or missing productId' },
			{ status: 400 }
		)
	}

	const pageNumber = parseInt(page as string, 10)
	const size = parseInt(pageSize as string, 10)

	if (isNaN(pageNumber) || isNaN(size) || size <= 0) {
		return NextResponse.json(
			{ error: 'Invalid page or pageSize' },
			{ status: 400 }
		)
	}

	try {
		const reviews = await getReviewsWithItem(productId, pageNumber)
		return NextResponse.json(reviews, { status: 200 })
	} catch (error) {
		console.error('Error fetching reviews:', error)
		return NextResponse.json(
			{ error, message: 'Failed to fetch reviews' },
			{ status: 500 }
		)
	}
}
