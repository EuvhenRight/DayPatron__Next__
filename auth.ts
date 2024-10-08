import authConfig from '@/auth.config'
import prisma from '@/lib/db/client'
import { getUserById } from '@/lib/services/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	adapter: PrismaAdapter(prisma) as Adapter,
	session: { strategy: 'jwt', maxAge: 60 * 60 },
	debug: true,
	callbacks: {
		async session({ session, token }) {
			console.log(token, 'token')
			if (token.sub && session.user) {
				session.user.id = token.sub
			}
			if (token.role && session.user) {
				session.user.role = token.role as 'ADMIN' | 'USER'
			}
			if (token.name && session.user) {
				session.user.name = token.name
			}
			return session
		},
		async jwt({ token }) {
			if (!token.sub) return token
			// GET USER FROM DB
			const existingUser = await getUserById(token.sub)

			if (!existingUser) return token
			// ADD ROLE TO JWT
			token.role = existingUser.role
			token.name = existingUser.name
			return token
		},
	},
	...authConfig,
})
