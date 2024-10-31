// app/api/register/delete-password.ts
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'
import { serve } from '@upstash/workflow/nextjs'

export const { POST } = serve<User>(async context => {
	// Get the email from the request payload
	const { email } = context.requestPayload

	if (!email) {
		throw new Error('Email is required.')
	}

	// Calculate the date for 15 minutes from now
	const fifteenMinutesFromNow = new Date()
	fifteenMinutesFromNow.setMinutes(fifteenMinutesFromNow.getMinutes() + 1)

	// Wait until the calculated date
	await context.sleepUntil('wait-for-fifteen-minutes', fifteenMinutesFromNow)

	await prisma.user.update({
		where: { email: email },
		data: {
			password: null,
			passwordExpiresAt: null,
		},
	})

	console.log(`Password for user ${email} deleted after 1 minutes.`)
})
