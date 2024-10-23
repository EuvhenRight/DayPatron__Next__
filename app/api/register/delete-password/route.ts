// app/api/user/auth/delete-password/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { email } = await request.json()

		if (!email) {
			return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
		}

		// Find the user based on userId
		const user = await prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true },
		})

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Update the user's password and expiration date
		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: null,
				passwordExpiresAt: null,
			},
		})

		console.log(`Deleted password for user with ID ${user.id}`)
		return NextResponse.json(
			{ message: `Password deleted for user with ID ${user.id}` },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error deleting password:', error)
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		)
	}
}
