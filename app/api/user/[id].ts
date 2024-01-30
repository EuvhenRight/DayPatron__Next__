// app/api/user/route.ts
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
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
export async function GET(request: NextRequest & { query: { id: string } }) {
	const { id } = request.query // Access the 'id' parameter from the URL
	console.log(id, 'id')
	try {
		// Use Prisma to find the user by ID
		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
		})

		// Check if the user is found
		if (!user) {
			return NextResponse.json("Users don't found", { status: 404 })
		}
		return NextResponse.json(user, { status: 200 })
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
