import { getSearchProducts } from '@/lib/services/products'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const url = new URL(request.url)
	const searchQuery = url.searchParams.get('searchQuery') || ''

	console.log(searchQuery, 'searchParams')

	if (!searchQuery || typeof searchQuery !== 'string') {
		return NextResponse.json(
			{ error: 'Invalid or missing searchQuery' },
			{ status: 400 }
		)
	}

	try {
		const products = await getSearchProducts(searchQuery)
		return NextResponse.json(products, { status: 200 })
	} catch (error) {
		console.error('Error fetching reviews:', error)
		return NextResponse.json(
			{ error, message: 'Failed to fetch reviews' },
			{ status: 500 }
		)
	}
}
