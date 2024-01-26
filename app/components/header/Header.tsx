import Link from 'next/link'

function Header() {
	const links = [
		{ label: 'Products', href: '/products' },
		{ label: 'About', href: '/about' },
		{ label: 'Where to Buy', href: '/where-to-buy' },
		{ label: 'Contacts', href: '/contacts' },
	]
	return (
		<header className='border-b border-gray-300'>
			<nav className='flex justify-between xl:container xl:mx-auto py-5'>
				<Link href='/'>LOGO</Link>
				<ul className='flex space-x-5'>
					{links.map(link => (
						<li key={link.href}>
							<Link
								className='text-zinc-500 hover:text-zinc-800 transition-colors'
								href={link.href}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
				<ul className='flex space-x-3'>
					<li>
						<Link href='/login'>Login</Link>
					</li>
					<li>Search</li>
					<li>Cart</li>
				</ul>
			</nav>
		</header>
	)
}

export default Header
