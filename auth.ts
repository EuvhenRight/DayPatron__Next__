import prisma from '@/lib/db/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import authConfig from './auth.config'

export const AuthOptions: NextAuthConfig = {
	adapter: PrismaAdapter(prisma),
	pages: {
		signIn: '/login',
		error: '/',
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	...authConfig,
}

export const {
	handlers: { GET, POST },
	auth,
} = NextAuth(AuthOptions)
