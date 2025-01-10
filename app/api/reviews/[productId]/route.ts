import { getReviewsWithItem } from '@/lib/services/reviews'
import { NextRequest, NextResponse } from 'next/server'

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
