// app/api/products/delete/[id]/route.ts
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const itemId = params.id
	try {
		const item = await prisma.product.delete({
			where: {
				id: itemId,
			},
		})
		if (!item) {
			return NextResponse.json('Product not found', { status: 404 })
		}
		return NextResponse.json({}, { status: 200 })
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
