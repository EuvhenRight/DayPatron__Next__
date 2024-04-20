import prisma from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const productId = params.id
		const requestData = await request.json()

		// Create the variant first
		const createdVariant = await prisma.variant.create({
			data: {
				image: requestData.image,
				name: requestData.name,
				volume: requestData.volume,
				article: requestData.article,
				discount_price: requestData.discount_price,
				original_price: requestData.original_price,
				stock: requestData.stock,
				productId: productId,
			},
		})

		// Connect the variant to the product
		await prisma.product.update({
			where: {
				id: productId,
			},
			data: {
				variant: {
					connect: {
						id: createdVariant.id,
					},
				},
			},
		})

		// Fetch the product with its variants
		const productWithVariants = await prisma.product.findUnique({
			where: {
				id: productId,
			},
			include: {
				variant: true,
			},
		})

		if (!productWithVariants) {
			return NextResponse.json('Product not found', { status: 404 })
		}

		return NextResponse.json({ product: productWithVariants }, { status: 200 })
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
