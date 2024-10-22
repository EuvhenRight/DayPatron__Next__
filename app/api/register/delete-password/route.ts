// app/api/user/auth/delete-password/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		// Get the current time
		const currentTime = new Date()

		// Find all users whose passwords have expired
		const users = await prisma.user.findMany({
			where: {
				passwordExpiresAt: {
					lte: currentTime,
				},
			},
		})

		// Update all found users
		for (const user of users) {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					password: null,
					passwordExpiresAt: null,
				},
			})
			console.log(`Deleted password for user with email ${user.email}`)
		}

		return NextResponse.json(
			{ message: `Password deletion process completed.` },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error checking for expired passwords:', error)

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
