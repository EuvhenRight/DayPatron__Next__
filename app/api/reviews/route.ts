import { createReview } from '@/lib/services/reviews'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const data = await request.json()
	console.log(data)
	try {
		const review = await createReview(data.productId)
		return NextResponse.json(review)
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		)
	}
}
