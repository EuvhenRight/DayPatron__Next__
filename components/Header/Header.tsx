'use client'
import { CartWithVariants } from '@/lib/types/types'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	AiOutlineClose,
	AiOutlineMenu,
	AiOutlineSearch,
	AiOutlineUser,
} from 'react-icons/ai'
import { Drawer } from '../Drawer/Drawer'
import { UserMenu } from './HeaderUserMenu'
import { Marquee } from './marquee'
import { MenuMobile } from './MenuMobile'

interface Props {
	cart: CartWithVariants | null
}

export const Header = ({ cart }: Props) => {
	const [isOpenMenu, setIsOpenMenu] = useState(false)
	const [isActive, setIsActive] = useState('')
	const pathName = usePathname()
	const { status } = useSession()
	const [prevScrollY, setPrevScrollY] = useState(0)
	const [showMarquee, setShowMarquee] = useState(true)

	const links = [
		{ label: 'Продукти', href: '/products' },
		{ label: 'Про нас', href: '/about' },
		{ label: 'Де купити', href: '/where-to-buy' },
		{ label: 'Контакти', href: '/contacts' },
	]

	// TOGGLE HAMBURGER MENU
	const toggleHamburger = () => {
		setIsOpenMenu(!isOpenMenu)
	}

	// TOGGLE ACTIVE LINK
	const toggleActive = (href: string) => {
		setIsActive(href)
	}

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY
			if (currentScrollY > prevScrollY) {
				// Scrolling down
				setShowMarquee(false)
			} else {
				// Scrolling up
				setShowMarquee(true)
			}
			setPrevScrollY(currentScrollY)
		}

		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [prevScrollY])

	return (
		<header className='shadow-md bg-neutral-800 fixed w-full top-0 left-0 z-50'>
			<AnimatePresence>
				{showMarquee && (
					<motion.div
						key='marquee'
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						transition={{
							type: 'tween',
							stiffness: 500,
							damping: 50,
						}}
						className='bg-neutral-800 border-b border-white py-1'
					>
						<Marquee />
					</motion.div>
				)}
			</AnimatePresence>
			<nav className='flex justify-between py-3 px-3 items-center container'>
				{/* LOGO */}
				<Link href='/' onClick={() => toggleActive('/')}>
					<Image
						className='w-32 lg:w-48'
						src='/images/DayLogo.svg'
						alt='logo'
						priority={true}
						width={300}
						height={100}
					/>
				</Link>
				{pathName !== '/checkouts' && (
					<>
						{/* LINKS MENU */}
						<ul className='md:flex md:gap-4 gap-2 md:text-xl text-md font-bold hidden'>
							{links.map(link => (
								<li key={link.href}>
									<Link
										className={classNames(
											'transition-colors text-white',
											'font-bold',
											'text-base',
											{
												'transition-colors': true,
											},
											{
												'border-b-2 border-b-red-500':
													isActive === link.href || pathName === link.href,
											}
										)}
										onClick={() => toggleActive(link.href)}
										href={link.href}
									>
										{link.label.toUpperCase()}
									</Link>
								</li>
							))}
						</ul>
						<ul className='flex md:gap-4 gap-6 justify-center items-center'>
							<li className='hidden md:block'>
								{/* LOGIN CONDITION */}
								{status === 'authenticated' ? (
									<UserMenu />
								) : (
									<Link
										href='/auth/register'
										onClick={() => toggleActive('/auth/register')}
									>
										<button className='w-8 h-8 cursor-pointer'>
											<AiOutlineUser className='w-full h-full' />
										</button>
									</Link>
								)}
							</li>
							<li>
								{/* SEARCH ICON */}
								<button
									className='w-8 h-8 cursor-pointer hidden md:block text-white'
									onClick={() => toggleActive('/search')}
								>
									<AiOutlineSearch className='w-full h-full' />
								</button>
							</li>
							<li>
								{/* SHOPPING CART ICON */}
								<Drawer cart={cart} />
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
										<AiOutlineMenu className='w-full h-full text-white' />
									</button>
								)}
								<MenuMobile
									isActive={isActive}
									toggleHamburger={toggleHamburger}
									isOpenMenu={isOpenMenu}
									toggleActive={toggleActive}
								/>
							</li>
						</ul>
					</>
				)}
			</nav>
		</header>
	)
}
