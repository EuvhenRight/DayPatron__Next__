'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
	AiOutlineAppstoreAdd,
	AiOutlineAreaChart,
	AiOutlineProject,
} from 'react-icons/ai'
import { UserNavItem } from './user-nav-item'

export const UserNav = () => {
	const pathName = usePathname()
	const router = useRouter()

	useEffect(() => {
		router.refresh()
	}, [router])

	const Items = [
		{
			icon: AiOutlineProject,
			label: 'Профіль',
			href: '/dashboard/profile',
		},
		{
			icon: AiOutlineAreaChart,
			label: 'Інформація',
			href: '/dashboard/information',
		},
		{
			icon: AiOutlineAppstoreAdd,
			label: 'Моє замовлення',
			href: '/dashboard/order',
		},
	]

	return (
		<div className='w-full shadow-sm top-20 border-b-[1px] pt-4 bg-gray-800'>
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
