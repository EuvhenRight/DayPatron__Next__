'use client'
import { useCart } from '@/lib/hooks/useCart'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useState } from 'react'
import {
	AiOutlineClose,
	AiOutlineMenu,
	AiOutlineSearch,
	AiOutlineShoppingCart,
	AiOutlineUser,
} from 'react-icons/ai'
import ThemeController from '../ThemeController'
import UserMenu from '../UserMenu'
import MenuMobile from './MenuMobile'

interface HeaderProps {
	toggleDrawer: () => void
}
const Header: React.FC<HeaderProps> = memo(({ toggleDrawer }) => {
	const [isOpenMenu, setIsOpenMenu] = useState(false)
	const { cartItems } = useCart()
	const [isActive, setIsActive] = useState('')
	const pathName = usePathname()

	const { data: session, status } = useSession()

	const links = [
		{ label: 'Products', href: '/products' },
		{ label: 'About', href: '/about' },
		{ label: 'Where to Buy', href: '/where-to-buy' },
		{ label: 'Contacts', href: '/contacts' },
	]
	// TOGGLE HAMBURGER MENU
	const toggleHamburger = () => {
		setIsOpenMenu(!isOpenMenu)
	}
	// TOGGLE ACTIVE LINK
	const toggleActive = (href: string) => {
		setIsActive(href)
	}

	return (
		<header className='border-b border-gray-300 bg-none relative flex justify-center'>
			<nav className='flex justify-between py-5 px-3 sm:px-0 items-center container'>
				{/* LOGO */}
				<Link href='/' onClick={() => toggleActive('/')}>
					<img className='w-32 lg:w-48' src='/images/DayLogo.svg' alt='logo' />
				</Link>
				{/* LINKS MENU */}
				<ul className='md:flex md:gap-4 gap-2 md:text-xl text-md font-bold hidden'>
					{links.map(link => (
						<li key={link.href}>
							<Link
								// CONDITION ACTIVE LINK
								className={classNames(
									{
										'hover:border-b-2 hover:border-b-red-500 transition-colors':
											true,
									},
									{
										'border-b-2 border-b-red-500':
											isActive === link.href || pathName === link.href,
									}
								)}
								onClick={() => toggleActive(link.href)}
								href={link.href}
							>
								{link.label}
							</Link>
						</li>
					))}
					{/* ICONS MENU */}
				</ul>
				<ul className='flex md:gap-4 gap-6 justify-center items-center'>
					<li className='hidden md:block'>
						{/* LOGIN CONDITION */}
						{status === 'authenticated' ? (
							<UserMenu />
						) : (
							<Link href='/login' onClick={() => toggleActive('/login')}>
								<button className='w-8 h-8 cursor-pointer'>
									<AiOutlineUser className='w-full h-full cursor-pointer' />
								</button>
							</Link>
						)}
					</li>
					<li>
						{/* SEARCH ICON */}
						<button
							className='w-8 h-8 cursor-pointer hidden md:block'
							onClick={() => toggleActive('/search')}
						>
							<AiOutlineSearch className='w-full h-full' />
						</button>
					</li>
					<li>
						{/* SHOPPING CART ICON */}
						<button className='w-8 h-8 cursor-pointer relative'>
							<AiOutlineShoppingCart
								className='w-full h-full'
								onClick={toggleDrawer}
							/>
							{/* CART INDICATOR */}
							{cartItems && cartItems.length > 0 && (
								<span className='inline-flex rounded-full h-4 w-4 bg-btnPrimary absolute top-0 right-0 border border-white'></span>
							)}
						</button>
					</li>
					<li className='cursor-pointer block md:hidden'>
						{/* HAMBURGER */}
						{/* CONDITION OPEN/CLOSE MENU */}
						{isOpenMenu ? (
							<>
								{/* CLOSE BUTTON MOBILE MENU */}
								<button
									className='m-4 p-1 w-8 h-8 marker:hover:translate-x-0 opacity-60 text-white hover:opacity-100 transition text-sm absolute top-2 right-2 z-50'
									onClick={toggleHamburger}
								>
									<AiOutlineClose className='w-full h-full' />
								</button>
							</>
						) : (
							<button className={'w-8 h-8'} onClick={toggleHamburger}>
								<AiOutlineMenu className='w-full h-full' />
							</button>
						)}
						<MenuMobile
							isActive={isActive}
							toggleHamburger={toggleHamburger}
							isOpenMenu={isOpenMenu}
							toggleActive={toggleActive}
						/>
					</li>
					<li>
						<button className='w-8 h-8 cursor-pointer relative justify-center items-center hidden md:flex'>
							<ThemeController />
						</button>
					</li>
				</ul>
			</nav>
		</header>
	)
})

export default Header
