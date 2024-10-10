'use server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
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

export const getCurrentUserById = async ({ id }: { id: string }) => {
	try {
		const currentUser = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		return currentUser
	} catch (error) {
		console.log(error, 'Щось пішло не так. Будь ласка, спробуйте знову пізніше')
	}
}

export const getCurrentRole = async () => {
	try {
		const session = await auth()

		return session?.user?.role
	} catch (error) {
		console.log(error, 'Щось пішло не так. Будь ласка, спробуйте знову пізніше')
	}
}

export const editInfoUser = async (
	id: string,
	firstName: string,
	lastName: string,
	phone: string
) => {
	try {
		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				firstName: firstName,
				lastName: lastName,
				phone: phone,
			},
		})

		revalidatePath('/dashboard/profile')
		return user
	} catch (error) {
		console.log(error, 'Щось пішло не так. Будь ласка, спробуйте знову пізніше')
	}
}
