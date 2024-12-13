import { Undo2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
	text: string
	back?: boolean
}

export const ButtonBack = ({ text, back }: Props) => {
	return (
		<div className='flex justify-center mb-14 mt-6'>
			<Link
				href='/products'
				className='bg-zinc-700  text-white py-2 px-4 rounded-md hover:scale-110 ease-out transition-all flex gap-2 items-center'
			>
				{text} {back && <Undo2 size={18} />}
			</Link>
		</div>
	)
}
