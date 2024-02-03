'use client'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaUserCircle } from 'react-icons/fa'
import { IoSearchSharp } from 'react-icons/io5'
import { TbShoppingCart } from 'react-icons/tb'

function Header() {
	const pathname = usePathname()

	const links = [
		{ label: 'Products', href: '/products' },
		{ label: 'About', href: '/about' },
		{ label: 'Where to Buy', href: '/where-to-buy' },
		{ label: 'Contacts', href: '/contacts' },
	]
	return (
		<header className='border-b border-gray-300 bg-none'>
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
							<FaUserCircle className='w-7 h-7 cursor-pointer' />
						</Link>
					</li>
					<li>
						<div className='w-7 h-7 cursor-pointer'>
							<IoSearchSharp className='w-full h-full' />
						</div>
					</li>
					<li>
						<div className='w-7 h-7 cursor-pointer'>
							<TbShoppingCart className='w-full h-full' />
						</div>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default Header
