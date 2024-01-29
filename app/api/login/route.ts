// app/api/user/login-route.ts
import prisma from '@/prisma/client'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const LoginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().length(6),
})

export async function POST(request: NextRequest) {
	try {
		const requestData = await request.json()

		// Validate the request body
		const validatedBody = LoginSchema.safeParse(requestData)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}

		// Check if the user exists in the database
		const existingUser = await prisma.user.findUnique({
			where: {
				email: requestData.email,
			},
		})

		if (existingUser) {
			// Check if the provided password matches the stored password
			if (requestData.password === existingUser.password) {
				// Password is correct
				const token = jwt.sign(
					{
						id: existingUser.id,
					},
					process.env.KEY_JWT_AUTH || '',
					{ expiresIn: '1d' }
				)

				return NextResponse.json({ ...existingUser, token }, { status: 200 })
			} else {
				// Password is incorrect
				return NextResponse.json(
					{ error: 'Invalid email or password' },
					{ status: 401 }
				)
			}
		} else {
			// User doesn't exist
			return NextResponse.json(
				{ error: 'User not found. Please register first.' },
				{ status: 404 }
			)
		}
	} catch (error) {
		console.error('Error processing login request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
