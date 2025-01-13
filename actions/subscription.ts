'use server'

import { cookies } from 'next/headers'

export async function addCookieToBannerOut() {
	await cookies().set('bannerOut', 'true', {
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set the expiration date to 1 month from now
	})
}
