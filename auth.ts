import authConfig from '@/auth.config'
import prisma from '@/lib/db/client'
import { getUserById } from '@/lib/db/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

export const {
	handlers: { GET, POST },
	auth,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: 'jwt' },
	callbacks: {
		async session({ session, token }) {
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
