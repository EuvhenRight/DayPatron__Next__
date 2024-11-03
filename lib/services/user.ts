import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'
import { cache } from 'react'

export const getCurrentSession = cache(async () => {
	try {
		const session = await auth()
		return session
	} catch (error) {
		console.log(error, 'Щось пішло не так. Будь ласка, спробуйте знову пізніше')
	}
})

export const getCurrentUser = cache(
	async (): Promise<User | null | undefined> => {
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
			console.log(
				error,
				'Щось пішло не так. Будь ласка, спробуйте знову пізніше'
			)
		}
	}
)

export const getUserByEmail = cache(async (email: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		})
		return user
	} catch {
		return null
	}
})

export const getUserById = async (id: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		return user
	} catch (error) {
		console.log(error)
		throw error
	}
}
