import { auth } from '@/auth'
import prisma from '@/lib/db/client'

export const getSession = async () => {
	const session = await auth()
	return session
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

		return {
			...currentUser,
			createdAt: currentUser.createdAt.toISOString(),
			updatedAt: currentUser.updatedAt.toISOString(),
			email: currentUser.email.toString(),
		}
	} catch (error) {
		console.log(error)
	}
}
