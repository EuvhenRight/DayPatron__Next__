'use client'
import { Undo2 } from 'lucide-react'
import Link from 'next/link'

export const ComebackButton = () => {
	return (
		<Link
			href='/'
			className='mt-6 flex items-center gap-4 transition-all group'
		>
			На головну
			<Undo2 size={18} className='transition-all group-hover:-translate-x-3' />
		</Link>
	)
}
