// app/api/user/route.ts
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const UserSchema = z.object({
	email: z.string().email(),
	password: z.number().min(6), // Adjust the minimum length as needed
})

interface User {
	email: string
	password: number
}

export async function POST(request: NextRequest) {
	const body: User = await request.json()
	const validatedBody = UserSchema.safeParse(body)
	if (!validatedBody.success) {
		return NextResponse.json(validatedBody.error.errors, { status: 400 })
	}
	const newUser = await prisma.user.create({
		data: {
			email: body.email,
			password: body.password,
			createdAt: new Date(), // Add createdAt property with the current timestamp
			updatedAt: new Date(), // Add updatedAt property with the current timestamp},
		},
	})
	return NextResponse.json(newUser, { status: 201 })
}
