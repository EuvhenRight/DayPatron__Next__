// app/api/products/edit/[id]/route.ts

import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { ValidationSchema } from './../../../../../prisma/validation'

export async function PATCH(
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

		const requestData = await request.json()

		// Validate the request body
		const validatedBody =
			ValidationSchema.newProductSchema.safeParse(requestData)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}
		// Update the product
		const updatedItem = await prisma.product.update({
			where: {
				id: itemId,
			},
			data: {
				...requestData,
			},
		})
		return NextResponse.json({ updatedItem }, { status: 202 })
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
