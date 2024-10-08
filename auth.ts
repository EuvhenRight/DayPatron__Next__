import authConfig from '@/auth.config'
import prisma from '@/lib/db/client'
import { getUserById } from '@/lib/services/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { type Adapter } from 'next-auth/adapters'

export const {
	handlers: { GET, POST },
	auth,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	adapter: PrismaAdapter(prisma) as Adapter,
	session: { strategy: 'jwt', maxAge: 60 * 60 },
	callbacks: {
		async jwt({ token }) {
			// Return the token as-is if no user id is present
			if (!token.sub) return token
			// Check if user role and name are already in the token
			if (token.role && token.name) {
				return token // If data is already available, return the token
			}
			// GET USER FROM DB
			const existingUser = await getUserById(token.sub)
			if (!existingUser) return token // Return token if user not found
			// ADD ROLE AND NAME TO JWT if not already present
			token.role = existingUser.role
			token.name = existingUser.name

			return token
		},
		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub
			}
			if (token.role && !session.user.role) {
				session.user.role = token.role as 'ADMIN' | 'USER' // Only set if not already present
			}
			if (token.name && !session.user.name) {
				session.user.name = token.name // Only set if not already present
			}
			return session
		},
	},
	...authConfig,
})
