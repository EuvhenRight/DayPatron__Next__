// app/api/user/route.ts
import prisma from '@/prisma/client'
import { generateRandomPassword, sendEmail } from '@/prisma/mail-password'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const AuthSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
})

export async function POST(request: NextRequest) {
	const passwordNew: string = generateRandomPassword()
	const body = await request.json()

	try {
		// Validate the request body
		const validatedBody = AuthSchema.safeParse(body)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}

		// Send email with the new password
		await sendEmail({
			to: body.email,
			subject: 'Your password',
			text: `Your password is: ${passwordNew}`,
		})

		// Check if the email already exists in the database
		const existingUser = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		})

		if (existingUser) {
			// If the user exists, update the password
			const updatedUser = await prisma.user.update({
				where: {
					email: body.email,
				},
				data: {
					password: passwordNew,
				},
				// Return the updated data of the existing user after the update
				include: {
					// Include any other fields you want to return in the response
				},
			})

			return NextResponse.json(updatedUser, { status: 201 })
		} else {
			// If the user doesn't exist, create a new user
			const newUser = await prisma.user.create({
				data: {
					email: body.email,
					password: passwordNew,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			})

			// Generate token for the new user
			const token = jwt.sign(
				{
					id: newUser.id,
				},
				process.env.KEY_JWT_AUTH || '', // secret code
				{ expiresIn: '30d' }
			)

			return NextResponse.json(newUser, { status: 201 })
		}
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
