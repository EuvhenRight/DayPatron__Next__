// app/api/user/auth/route.ts
import { ValidationSchema } from '@/lib/db/validation'
import prisma from '@/lib/prisma'
import { sendLoginPassword } from '@/lib/services/email-template'
import { generateRandomPassword } from '@/lib/services/mail-password'
import { Client } from '@upstash/qstash'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const generatedPassword: string = generateRandomPassword()
	const requestData = await request.json()
	const currentEmail = requestData.email.toLowerCase()

	try {
		// Validate the request body
		const validatedBody = ValidationSchema.authUser.safeParse(requestData)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}
		// Send email with the new password
		await sendLoginPassword({ email: currentEmail, generatedPassword })
		// Check if the email already exists in the database
		const existingUser = await prisma.user.findUnique({
			where: {
				email: currentEmail,
			},
		})

		if (existingUser) {
			// If the user exists, update the password
			const updatedUser = await prisma.user.update({
				where: {
					email: currentEmail,
				},
				data: {
					password: generatedPassword,
					// 15 minutes expiration
					passwordExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
				},
			})

			// Call the delete-password API to schedule the deletion
			await schedulePasswordDeletionAPI(updatedUser.email)

			return NextResponse.json({ ...updatedUser }, { status: 201 })
		} else {
			// If the user doesn't exist, create a new user
			const newUser = await prisma.user.create({
				data: {
					email: currentEmail,
					password: generatedPassword,
					// 15 minutes expiration
					passwordExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			})

			// Call the delete-password API to schedule the deletion
			await schedulePasswordDeletionAPI(newUser.email)

			return NextResponse.json({ ...newUser }, { status: 201 })
		}
	} catch (error) {
		console.error('Error processing request:', error)

		let errorMessage = 'An unexpected error occurred'

		if (error instanceof Error) {
			errorMessage = error.message
		} else if (typeof error === 'string') {
			errorMessage = error
		} else if (
			typeof error === 'object' &&
			error !== null &&
			'message' in error
		) {
			errorMessage = (error as any).message
		}

		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}

const qstashClient = new Client({
	token: process.env.QSTASH_TOKEN as string,
})
// Function to call the deletion endpoint
async function schedulePasswordDeletionAPI(email: string) {
	try {
		if (!email) {
			throw new Error('Email is required')
		}

		// Call the delete-password API
		await qstashClient.publishJSON({
			url: `${process.env.NEXT_PUBLIC_UPSTASH_WORKFLOW_URL}/api/register/delete-password`,
			body: { email }, // Pass the userId for deletion
		})
	} catch (error) {
		console.error('Error scheduling password deletion:', error)
	}
}
