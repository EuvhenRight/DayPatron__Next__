import {
	apiAuthPrefix,
	authRoutes,
	DEFAULT_LOGIN_REDIRECT,
	publicRoutes,
} from '@/routes'
import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export default auth(req => {
	const { nextUrl } = req
	const isLoggedIn = !!req.auth

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

	const isAuthRoute = authRoutes.includes(nextUrl.pathname)

	const isPublicRoute = publicRoutes.some(route => {
		// Use the includes() method to check if the requested URL matches any of the public routes
		if (route.endsWith('*')) {
			// If the route ends with '*', check if the requested URL starts with the route path
			return nextUrl.pathname.startsWith(route.slice(0, -1))
		} else {
			// Otherwise, check if the requested URL exactly matches the route path
			return nextUrl.pathname === route
		}
	})

	if (isApiAuthRoute) {
		return null
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
		}
		return null
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL('/auth/register', nextUrl))
	}
	return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
