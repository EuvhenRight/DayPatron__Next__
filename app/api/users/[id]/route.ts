// app/api/user/route.ts
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// const UserSchema = z.object({
// 	name: z.string().min(3, 'must contain 3 or more items').nullable(),
// 	lastName: z.string().min(3, 'must contain 3 or more items').nullable(),
// 	email: z.string().email({ message: 'Invalid email address' }),
// 	phoneNumber: z.number().nullable(),
// 	city: z.string().nullable(),
// 	streetName: z.string().nullable(),
// 	houseNumber: z.number().nullable(),
// 	additionNumber: z.string().nullable(),
// 	zipCode: z.string().nullable(),
// 	logisticCompany: z.string().nullable(),
// 	department: z.string().nullable(),
// 	orders: z.string().array().nullable(),
// })
// interface User {
// 	name: string
// 	lastName: string
// 	email: string
// 	phoneNumber: number
// 	city: string
// 	streetName: string
// 	houseNumber: number
// 	additionNumber: string
// 	zipCode: string
// 	logisticCompany: string
// 	department: string
// 	orders: string[]
// }
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const userId = params.id
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
		if (!user) {
			return NextResponse.json('User not found', { status: 404 })
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
