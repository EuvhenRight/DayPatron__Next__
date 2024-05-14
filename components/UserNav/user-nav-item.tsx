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
			className={`flex text-center justify-center gap-1 items-center p-2 border-b-2 text-primary-content hover:text-base-content transition cursor-pointer ${
				isActive ? 'text-secondary border-b-secondary' : 'border-b-transparent'
			}`}
		>
			<Icon size={26} />
			<div className='font-medium text-sm text-center break-normal'>
				{label}
			</div>
		</div>
	)
}
