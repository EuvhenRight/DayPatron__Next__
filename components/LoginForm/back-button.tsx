'use client'
import Link from 'next/link'

interface Props {
	label: string
	href: string
}

export const BackButton = ({ label, href }: Props) => {
	return (
		<Link href={href} className='w-full text-center hover:underline'>
			{label}
		</Link>
	)
}
