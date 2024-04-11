'use client'
import Link from 'next/link'

interface PrivacyButtonProps {
	label?: string
	href: string
}

export const PrivacyButton = ({ label, href }: PrivacyButtonProps) => {
	return (
		<Link href={href} className='text-center hover:underline'>
			{label}
		</Link>
	)
}
