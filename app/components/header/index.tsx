'use client'
import { useCart } from '@/app/lib/hooks/useCart'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	AiOutlineSearch,
	AiOutlineShoppingCart,
	AiOutlineUser,
} from 'react-icons/ai'
import ThemeController from '../ThemeController'

interface Props {
	toggleDrawer: () => void
}
function Header({ toggleDrawer }: Props) {
	const pathname = usePathname()
	const { cartItems } = useCart()
	console.log(cartItems)
	const links = [
		{ label: 'Products', href: '/products' },
		{ label: 'About', href: '/about' },
		{ label: 'Where to Buy', href: '/where-to-buy' },
		{ label: 'Contacts', href: '/contacts' },
	]
	return (
		<header className='border-b border-gray-300 bg-none relative dark:border-red-500'>
			<nav className='flex justify-between xl:container xl:mx-auto py-5 items-center'>
				<Link href='/'>
					<img className='w-48' src='/images/DayLogo.svg' alt='logo' />
				</Link>
				<ul className='flex space-x-5'>
					{links.map(link => (
						<li key={link.href}>
							<Link
								className={classNames({
									'text-zinc-900': pathname === link.href,
									'text-zinc-500': pathname !== link.href,
									'hover:text-zinc-700 transition-colors': true,
								})}
								href={link.href}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
				<ul className='flex space-x-6 justify-center items-center'>
					<li>
						<Link href='/login'>
							<AiOutlineUser className='w-7 h-7 cursor-pointer' />
						</Link>
					</li>
					<li>
						<div className='w-7 h-7 cursor-pointer'>
							<AiOutlineSearch className='w-full h-full' />
						</div>
					</li>
					<li>
						<div className='w-7 h-7 cursor-pointer relative'>
							<AiOutlineShoppingCart
								className='w-full h-full'
								onClick={toggleDrawer}
							/>
							{cartItems && cartItems.length > 0 && (
								<span className='inline-flex rounded-full h-3 w-3 bg-btnPrimary absolute top-0 right-0 border border-white'></span>
							)}
						</div>
					</li>
				</ul>
			</nav>
			<div className='absolute top-9 right-5'>
				<ThemeController />
			</div>
		</header>
	)
}

export default Header
