import { ValidationSchema } from '@/lib/db/validation'
// app/api/user/login-route.ts
import prisma from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const requestData = await request.json()

		// Validate the request body
		const validatedBody =
			ValidationSchema.newProductSchema.safeParse(requestData)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}

		const newItem = await prisma.product.create({
			data: {
				...requestData,
			},
		})
		return NextResponse.json({ newItem }, { status: 201 })
	} catch (error) {
		console.error('Error processing login request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
