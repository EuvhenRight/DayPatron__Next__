// app/api/products/edit/[id]/route.ts

import prisma from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'
// import { ValidationSchema } from '../../../../../lib/db/validation'

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const itemId = params.id
	try {
		const item = await prisma.user.findUnique({
			where: {
				id: itemId,
			},
		})
		if (!item) {
			return NextResponse.json('User not found', { status: 404 })
		}

		const requestData = await request.json()

		// // Validate the request body
		// const validatedBody =
		// 	ValidationSchema.newProductSchema.safeParse(requestData)
		// if (!validatedBody.success) {
		// 	return NextResponse.json(validatedBody.error.errors, { status: 400 })
		// }
		// Update the product
		const updatedItem = await prisma.user.update({
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
