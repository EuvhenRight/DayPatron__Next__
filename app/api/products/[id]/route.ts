// app/api/products/[id]/route.ts
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const itemId = params.id
	try {
		const item = await prisma.product.findUnique({
			where: {
				id: itemId,
			},
		})
		if (!item) {
			return NextResponse.json('Product not found', { status: 404 })
		}
		return NextResponse.json({ item }, { status: 200 })
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
