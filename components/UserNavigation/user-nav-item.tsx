'use client'
import { IconType } from 'react-icons/lib'

interface Props {
	label: string
	icon: IconType
	isActive?: boolean
}

export const UserNavItem = ({ label, icon: Icon, isActive }: Props) => {
	return (
		<div
			className={`flex text-center justify-center gap-1 items-center md:p-3 text-sm md:text-md border-b-2 text-white hover:text-base-content transition cursor-pointer ${
				isActive
					? 'text-zinc-300 border-b-red-500 py-1'
					: 'border-b-transparent'
			}`}
		>
			<Icon className='h-6 w-6 md:h-8 md:w-8' />
			<div className='font-medium text-md text-center break-normal'>
				{label}
			</div>
		</div>
	)
}
