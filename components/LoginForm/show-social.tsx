'use client'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'

export const ShowSocial = () => {
	const handleGoogle = (provider: 'google') => {
		signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
	}

	return (
		<Button
			size='lg'
			variant='default'
			className='w-full mt-3'
			onClick={() => handleGoogle('google')}
		>
			Увійдіть за допомогою Google
		</Button>
	)
}
