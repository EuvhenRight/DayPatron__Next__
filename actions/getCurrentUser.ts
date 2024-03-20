import prisma from '@/lib/db/client'
import { getServerSession } from 'next-auth'
import { AuthOptions } from '../app/api/auth/[...nextauth]/route'

export const getSession = async () => {
	const session = await getServerSession(AuthOptions)
	return session
}

export const getCurrentUser = async () => {
	try {
		const session = await getSession()

		if (!session?.user?.email) {
			return null
		}
		const currentUser = await prisma.user.findUnique({
			where: {
				email: session?.user?.email,
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
