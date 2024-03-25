'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	AiOutlineAppstoreAdd,
	AiOutlineAreaChart,
	AiOutlineProject,
} from 'react-icons/ai'
import UserNavItem from './user-nav-item'
const UserNav = () => {
	const pathName = usePathname()

	const Items = [
		{
			icon: AiOutlineProject,
			label: 'Profile',
			href: '/dashboard/profile',
		},
		{
			icon: AiOutlineAreaChart,
			label: 'Information',
			href: '/dashboard/information',
		},
		{
			icon: AiOutlineAppstoreAdd,
			label: 'Order',
			href: '/dashboard/order',
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
						<UserNavItem
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

export default UserNav
