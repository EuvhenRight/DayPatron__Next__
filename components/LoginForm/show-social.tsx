'use client'
import { AiOutlineGoogle } from 'react-icons/ai'

export const ShowSocial = () => {
	return (
		<button
			className='btn btn-outline btn-default rounded-md'
			onClick={() => console.log('Google')}
		>
			<AiOutlineGoogle className='w-5 h-5' />
		</button>
	)
}
