'use client'
import React from 'react'
import { IconType } from 'react-icons/lib'

interface AdminNavItemProps {
	label: string
	icon: IconType
	isActive?: boolean
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({
	label,
	icon: Icon,
	isActive,
}) => {
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

export default AdminNavItem
