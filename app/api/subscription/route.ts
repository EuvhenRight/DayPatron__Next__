// app/api/user/auth/route.ts
import { ValidationSchema } from '@/lib/db/validation'
import prisma from '@/lib/prisma'
import { mailBannerHtml } from '@/lib/services/mail-banner-layout'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const requestData = await request.json()
	const currentEmail = requestData.email.toLowerCase()

	try {
		// Validate the request body
		const validatedBody = ValidationSchema.authUser.safeParse(requestData)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}
		// Send email with the new password

		// Check if the email already exists in the database
		const existingUser = await prisma.user.findUnique({
			where: {
				email: currentEmail,
			},
		})

		if (existingUser) {
			// If the user exists, send email
			await mailBannerHtml({ email: currentEmail })

			cookies().set('bannerSeen', existingUser.id)

			return NextResponse.json({ ...existingUser }, { status: 201 })
		} else {
			// If the user doesn't exist, create a new user
			const newUser = await prisma.user.create({
				data: {
					email: currentEmail,
				},
			})
			// Send email
			await mailBannerHtml({ email: currentEmail })

			cookies().set('bannerSeen', newUser.id)
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
