// app/api/user/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'

const UserSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.length(6, { message: 'Must be exactly 6 characters long' }), // Add password validation
})

export async function GET(request: NextRequest) {}
export async function POST(request: NextRequest) {}
