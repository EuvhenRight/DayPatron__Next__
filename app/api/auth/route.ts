// app/api/user/auth/route.ts
import prisma from '@/prisma/client'
import { generateRandomPassword, sendEmail } from '@/prisma/mail-password'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import cron from 'node-cron'
import { ValidationSchema } from './../../../prisma/validation'

export async function POST(request: NextRequest) {
	const generatedPassword: string = generateRandomPassword()
	const requestData = await request.json()

	try {
		// Validate the request body
		const validatedBody = ValidationSchema.authUser.safeParse(requestData)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}
		// Send email with the new password
		await sendEmail({
			to: requestData.email,
			subject: 'DayPatron 6-значний пароль',
			text: `Ваш 6-значний пароль: ${generatedPassword} Цей код може бути використаний лише один раз. Він закінчується через 15 хвилин. 
			© 2023 DayPatron Inc. Усі права захищені`,
			html: `<p style="font-size: 14px; color: #666;">Ваш 6-значний пароль: <strong>${generatedPassword}</strong></p>
			<p style="font-size: 14px; color: #666;">Цей код може бути використаний лише один раз. Він закінчується через 15 хвилин.</p>
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
			// Schedule a task to delete the password after 15 minutes
			schedulePasswordDeletion(updatedUser.id, 15)
			// Generate token for the new user
			const token = jwt.sign(
				{
					id: updatedUser.id,
				},
				process.env.KEY_JWT_AUTH!, // secret code
				{ expiresIn: '1d' } // one day
			)
			return NextResponse.json({ ...updatedUser, token }, { status: 201 })
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

			// Generate token for the new user
			const token = jwt.sign(
				{
					id: newUser.id,
				},
				process.env.KEY_JWT_AUTH!, // secret code
				{ expiresIn: '1d' } // one day
			)

			return NextResponse.json({ ...newUser, token }, { status: 201 })
		}
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
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
