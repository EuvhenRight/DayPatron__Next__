import prisma from '@/lib/db/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'

export const AuthOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialProvider({
			type: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					if (!credentials?.email || !credentials?.password) {
						throw new Error('Invalid email or password')
					}
					const user = await prisma.user.findUnique({
						where: {
							email: credentials.email,
						},
					})
					if (!user || user.password !== credentials.password) {
						throw new Error('Invalid email or password')
					}
					return user
				} catch (error) {
					console.log(error)
				}
				return null
			},
		}),
	],
	pages: {
		signIn: '/login',
		error: '/',
	},
	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(AuthOptions)
export { handler as GET, handler as POST }
