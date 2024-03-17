// app/api/user/login-route.ts
import prisma from '@/app/lib/db/client'
import { ValidationSchema } from '@/app/lib/db/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const requestData = await request.json()
		// Validate the request body
		const validatedBody = ValidationSchema.loginUser.safeParse(requestData)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}
		// Check if the user exists in the database
		const existingUser = await prisma.user.findUnique({
			where: {
				email: requestData.email,
			},
		})

		if (!existingUser) {
			// User doesn't exist
			return NextResponse.json(
				{ error: 'User not found. Please register first.' },
				{ status: 404 }
			)
		}

		if (existingUser.password !== requestData.password) {
			// Password doesn't match
			return NextResponse.json(
				{ error: 'Incorrect password. Please try again.' },
				{ status: 401 }
			)
		}

		return NextResponse.json({ existingUser }, { status: 200 })
	} catch (error) {
		console.error('Error processing login request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
