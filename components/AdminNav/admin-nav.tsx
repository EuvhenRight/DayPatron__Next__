'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	AiOutlineAppstore,
	AiOutlineAppstoreAdd,
	AiOutlineAreaChart,
	AiOutlineProject,
} from 'react-icons/ai'
import { AdminNavItem } from './admin-nav-item'
export const AdminNav = () => {
	const pathName = usePathname()

	const Items = [
		{
			icon: AiOutlineProject,
			label: 'Projects',
			href: '/admin/dashboard',
		},
		{
			icon: AiOutlineAppstoreAdd,
			label: 'AddProducts',
			href: '/admin/add-product',
		},
		{
			icon: AiOutlineAppstore,
			label: 'Users',
			href: '/admin/manage-products',
		},
		{
			icon: AiOutlineAreaChart,
			label: 'Orders',
			href: '/admin/manage-orders',
		},
	]

	return (
		<div className='w-full shadow-sm top-20 border-b-[1px] pt-4'>
			<div
				className='w-full flex flex-row justify-between items-center 
			md:justify-center gap-8 md:gap-12 overflow-x-auto flex-nowrap'
			>
				{Items.map((item, index) => (
					<Link href={item.href} key={index}>
						<AdminNavItem
							label={item.label}
							isActive={pathName === item.href}
							icon={item.icon}
						/>
					</Link>
				))}
			</div>
		</div>
	)
}
