// app/api/user/route.ts
import prisma from '@/prisma/client'
import { generateRandomPassword } from '@/prisma/mail-password'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const UserSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.length(6, { message: 'Must be exactly 6 characters long' }), // Add password validation
})

export async function POST(request: NextRequest) {
	const passwordNew: string = generateRandomPassword()
	const body = await request.json()
	// await sendEmail({
	// 	to: body.email,
	// 	subject: 'Your password',
	// 	text: `Your password is: ${passwordNew}`,
	// })
	const validatedBody = UserSchema.safeParse(body)
	console.log(body, 'body')
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

	const token = jwt.sign(
		{
			id: newUser.id,
		},
		process.env.KEY_JWT_AUTH || '', // secret code
		{ expiresIn: '30d' } // expire in 30 days
	)
	return NextResponse.json(newUser, { status: 201 })
}
