// app/api/user/route.ts
import prisma from '@/prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const UserSchema = z.object({
	name: z.string().min(3, 'must contain 3 or more items').nullable(),
	lastName: z.string().min(3, 'must contain 3 or more items').nullable(),
	email: z.string().email({ message: 'Invalid email address' }),
	phoneNumber: z.number().nullable(),
	city: z.string().nullable(),
	streetName: z.string().nullable(),
	houseNumber: z.number().nullable(),
	additionNumber: z.string().nullable(),
	zipCode: z.string().nullable(),
	logisticCompany: z.string().nullable(),
	department: z.string().nullable(),
	orders: z.string().array().nullable(),
})
export async function GET() {
	try {
		const users = await prisma.user.findMany()
		if (!users) {
			return NextResponse.json("Users don't found", { status: 404 })
		}
		return NextResponse.json(users, { status: 200 })
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
