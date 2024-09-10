import { getSearchProducts } from '@/lib/services/products'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const searchQuery = request.nextUrl.searchParams.get('searchQuery') || ''
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
