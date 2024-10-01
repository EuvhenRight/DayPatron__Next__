import prisma from '@/lib/db/client'

export const getUserByEmail = async (email: string) => {
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
