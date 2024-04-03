import type { NextAuthConfig } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
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
					const user = await prisma?.user?.findUnique({
						where: {
							email: credentials.email as string,
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
} satisfies NextAuthConfig
