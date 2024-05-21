'use server'
import { auth } from '@/auth'
import prisma from '@/lib/db/client'
import { type DefaultSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export type ExtendedUser = DefaultSession['user'] & {
	role: 'ADMIN' | 'USER'
}

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: ExtendedUser
	}
}

export const getCurrentSession = async () => {
	try {
		const session = await auth()
		return session
	} catch (err) {
		console.log(err)
	}
}

export const getCurrentUser = async () => {
	try {
		const session = await auth()

		const currentUser = await prisma.user.findUnique({
			where: {
				email: session?.user?.email as string,
			},
		})

		if (!currentUser) {
			return null
		}

		return currentUser
	} catch (error) {
		console.log(error)
	}
}

export const getCurrentUserById = async ({ id }: { id: string }) => {
	try {
		const currentUser = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		return currentUser
	} catch (error) {
		console.log(error)
	}
}

export const getCurrentRole = async () => {
	try {
		const session = await auth()

		return session?.user?.role
	} catch (error) {
		console.log(error)
	}
}

export const editInfoUser = async (
	id: string,
	firstName: string,
	lastName: string
) => {
	const user = await prisma.user.update({
		where: {
			id,
		},
		data: {
			firstName: firstName,
			lastName: lastName,
		},
	})

	revalidatePath('/dashboard/profile')
	return user
}
