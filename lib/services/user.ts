import prisma from '@/lib/db/client'
import { User } from 'next-auth'

export const getUserByEmail = async (email: string): Promise<User | null> => {
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
}

export const getUserById = async (id: string): Promise<User | null> => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		return user
	} catch {
		return null
	}
}
