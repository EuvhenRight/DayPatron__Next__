/**
 * An array of routes that are accessible to the public.
 * These routes are not protected by authentication
 * @type {string[]}
 */
export const publicRoutes = [
	'/',
	'/about',
	'/products',
	'/products/*',
	'/contacts',
	'/partners',
	'/delivery',
	'/warranty',
	'/guide',
	'/images/*',
	'/icons/*',
	'/videos/*',
	'/privacy',
]

/**
 * An array of routes that are used for authentication.
 * These routes will redirect to the dashboard page.
 * @type {string}
 */
export const authRoutes = ['/auth/register', '/auth/login', '/auth/error']

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used this API authentication purposes.
 * @type {string}
 */

export const apiAuthPrefix = 'api/auth'

/**
 * The default redirect path after authentication.
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = '/dashboard/profile'

/**
 * An array routes that are used for authentication and admin.
 * These routes will redirect to the admin page.
 * @type {string[]}
 */
export const adminRoutes = ['/admin', '/admin/*']
