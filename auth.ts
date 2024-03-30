import prisma from '@/lib/db/client'
import { getUserById } from '@/lib/db/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import authConfig from './auth.config'

export const AuthOptions: NextAuthConfig = {
	adapter: PrismaAdapter(prisma),
	pages: {
		signIn: '/auth/login',
		error: '/',
	},
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub
			}

			if (token.role && session.user) {
				session.user.role = token.role as 'ADMIN' | 'USER'
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

			return token
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	...authConfig,
}

export const {
	handlers: { GET, POST },
	auth,
} = NextAuth(AuthOptions)
