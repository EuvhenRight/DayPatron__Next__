// app/api/user/auth/delete-password/route.ts
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import cron from 'node-cron'

let jobScheduled = false

function schedulePasswordDeletion(email: string) {
	if (jobScheduled) {
		console.log('Password deletion job is already scheduled.')
		return
	}

	// Schedule a job to run every minute
	const job = cron.schedule('*/15 * * * *', async () => {
		try {
			// Get the current time
			const currentTime = new Date()

			// Find the user by email whose password has expired
			const user = await prisma.user.findUnique({
				where: { email },
			})

			if (user && user.passwordExpiresAt! <= currentTime) {
				// Delete the password for the expired user
				await prisma.user.update({
					where: { id: user.id },
					data: {
						password: null,
						passwordExpiresAt: null,
					},
				})

				console.log(`Deleted password for user with email ${email}`)
			}
		} catch (error) {
			console.error('Error checking for expired passwords:', error)
		}
	})

	job.start() // Start the cron job
	jobScheduled = true // Mark job as scheduled
}

export async function POST(request: NextRequest) {
	const requestData = await request.json()

	try {
		const { email } = requestData // Extract the email from request data

		// Schedule the job for this specific email
		schedulePasswordDeletion(email)

		return NextResponse.json(
			{ message: `Password deletion scheduled for ${email}.` },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error scheduling password deletion:', error)

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
