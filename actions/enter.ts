'use server'
import { signIn } from '@/auth'
import prisma from '@/lib/db/client'
import { ValidationSchema } from '@/lib/db/validation'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { User } from '@prisma/client'
import { error } from 'console'
import { z } from 'zod'

export async function enter(data: z.infer<typeof ValidationSchema.loginUser>) {
	try {
		// Validate the request body
		const validatedBody = ValidationSchema.loginUser.safeParse(data)
		if (!validatedBody.success) {
			return error(validatedBody.error.errors)
		}
		let existingUser: User | null = null

		// Check if the user exists in the database
		existingUser = await prisma.user.findUnique({
			where: {
				email: data.email,
			},
		})

		if (!existingUser) {
			// User doesn't exist
			return null
		}

		if (existingUser.password !== data.password) {
			// Password doesn't match
			return null
		}
		await signIn('credentials', {
			email: data.email,
			password: data.password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		})
	} catch (error) {
		console.log(error)
	}
}
