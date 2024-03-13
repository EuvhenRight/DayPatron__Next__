'use client'
import classNames from 'classnames'
import Link from 'next/link'
import { memo } from 'react'
import ThemeController from '../ThemeController'

interface Props {
	isActive: string
	isOpenMenu: boolean
	toggleHamburger: () => void
	toggleActive: (href: string) => void
}
const MenuMobile: React.FC<Props> = memo(
	({ isOpenMenu, toggleHamburger, toggleActive, isActive }) => {
		const menuItems = [
			{ label: 'Home', href: '/' },
			{ label: 'Products', href: '/products' },
			{ label: 'About', href: '/about' },
			{ label: 'Where to Buy', href: '/where-to-buy' },
			{ label: 'Contacts', href: '/contacts' },
			{ label: 'Log out', href: '/api/auth/logout' },
		]

		return (
			<div
				className={`fixed top-0 left-0 right-0 bottom-0 w-full h-full z-10 ${
					isOpenMenu ? 'translate-x-0' : 'translate-x-full'
				} ease-in-out duration-300`}
			>
				<div
					className={`bg-drawers absolute top-0 right-0 h-full w-full sm:w-96 p-4 flex flex-col text-drawerText font-bold`}
				>
					{/* MENU */}
					<div className='gap-5 border-b-2'>
						<div className='flex flex-col text-white py-4'>
							<ul className='text-xl'>
								{/* TODO: fix layout */}
								{menuItems.map((link, index) => (
									<li key={index} onClick={toggleHamburger} className='py-2'>
										<Link
											className={classNames({
												'border-b-2 border-b-red-500': isActive === link.href,
											})}
											onClick={() => toggleActive(link.href)}
											href={link.href}
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
					<button className='w-8 h-8 m-4' onClick={toggleHamburger}>
						<ThemeController />
					</button>
				</div>
			</div>
		)
	}
)
export default MenuMobile
