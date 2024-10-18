// app/api/user/auth/route.ts
import { ValidationSchema } from '@/lib/db/validation'
import prisma from '@/lib/prisma'
import { generateRandomPassword, sendEmail } from '@/lib/services/mail-password'
import { NextRequest, NextResponse } from 'next/server'
import cron from 'node-cron'

export async function POST(request: NextRequest) {
	const generatedPassword: string = generateRandomPassword()
	const requestData = await request.json()

	try {
		// Validate the request body
		const validatedBody = ValidationSchema.authUser.safeParse(requestData)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}
		//Send email with the new password
		await sendEmail({
			to: requestData.email,
			subject: 'DayPatron 6-значний пароль',
			text: `Ваш 6-значний пароль: ${generatedPassword} Цей код може бути використаний лише один раз. Він закінчується через 15 хвилин.
			© 2023 DayPatron Inc. Усі права захищені`,
			html: `<p style="font-size: 14px; color: #666;">Ваш 6-значний пароль: <strong>${generatedPassword}</strong></p>
			<p style="font-size: 14px; color: #666;">Цей код може бути використаний лише один раз. Він закінчується через 15 хвилин.</p>
					<p>З повагою,<br>Команда підтримки DayPatron<br>
			<img src="process.env.PUBLIC_IMAGE_URL/DayLogo_black.svg" alt="DayPatron Logo" style="display: block; width: 150px; height: 50px;">
			</p>
					<p style="font-size: 12px; color: #999;">телефон:  +38 (099) 730-21-26 <br>ел.пошта: daypatronteam@gmail.com <br>cайт: http://www.daypatron.com</p>
			<p style="font-size: 12px; color: #999; text-align: center">© 2023 DayPatron Inc. Усі права захищені</p>`,
		})

		// Check if the email already exists in the database
		const existingUser = await prisma.user.findUnique({
			where: {
				email: requestData.email,
			},
		})

		if (existingUser) {
			// If the user exists, update the password
			const updatedUser = await prisma.user.update({
				where: {
					email: requestData.email,
				},
				data: {
					password: generatedPassword,
					// 15 minutes expiration
					passwordExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
				},
				// Return the updated data of the existing user after the update
				include: {
					// Include any other fields you want to return in the response
				},
			})
			//Schedule a task to delete the password after 15 minutes
			schedulePasswordDeletion(updatedUser.id, 15)
			// Generate token for the new user

			return NextResponse.json({ ...updatedUser }, { status: 201 })
		} else {
			// If the user doesn't exist, create a new user
			const newUser = await prisma.user.create({
				data: {
					email: requestData.email,
					password: generatedPassword,
					// 15 minutes expiration
					passwordExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			})
			// Schedule a task to delete the password after 15 minutes
			schedulePasswordDeletion(newUser.id, 15)
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

function schedulePasswordDeletion(userId: string, minutes: number) {
	const job = cron.schedule(`*/${minutes} * * * *`, async () => {
		try {
			// Delete the password for the user
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					password: null,
					passwordExpiresAt: null,
				},
			})

			console.log(`Password deleted for user with ID ${userId}`)
			job.stop() // Destroy the cron job after execution
		} catch (error) {
			console.error('Error deleting password:', error)
		}
	})

	job.start() // Start the cron job
}
