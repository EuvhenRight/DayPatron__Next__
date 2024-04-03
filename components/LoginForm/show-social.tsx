'use client'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { signIn } from 'next-auth/react'
import { AiOutlineGoogle } from 'react-icons/ai'

export const ShowSocial = () => {
	const handleGoogle = (provider: 'google') => {
		signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
	}

	return (
		<button
			className='btn btn-outline btn-default rounded-md'
			onClick={() => handleGoogle('google')}
		>
			<AiOutlineGoogle className='w-5 h-5' />
		</button>
	)
}
