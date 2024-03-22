'use client'
import Link from 'next/link'

interface BackButtonProps {
	label: string
	href: string
}

export const BackButton = ({ label, href }: BackButtonProps) => {
	return (
		<Link href={href} className='w-full text-center hover:underline'>
			{label}
		</Link>
	)
}
