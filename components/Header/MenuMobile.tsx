'use client'
import { LogOutModal } from '@/components/SignOut/sign-out'
import classNames from 'classnames'
import { LogOut } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
	isActive: string
	isOpenMenu: boolean
	toggleHamburger: () => void
	toggleActive: (href: string) => void
}
export const MenuMobile = ({
	isOpenMenu,
	toggleHamburger,
	toggleActive,
	isActive,
}: Props) => {
	const pathName = usePathname()
	const { data: session, status } = useSession()

	// NAME OF USER
	const currentName =
		session?.user?.name === null ? 'Account' : session?.user?.name

	const currenRole =
		session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard/profile'

	const menuItems = [
		{ label: 'Головна', href: '/' },
		{ label: 'Продукти', href: '/products' },
		{ label: 'Про нас', href: '/about' },
		{ label: 'Партнери', href: '/partners' },
		{ label: 'Контакти', href: '/contacts' },
		session
			? { label: currentName, href: currenRole, special: true }
			: { label: 'Профіль', href: '/auth/register' },
	]

	return (
		<div
			className={`fixed top-0 left-0 right-0 bottom-0 w-full z-20 ${
				isOpenMenu ? 'translate-x-0' : 'translate-x-full'
			} ease-in-out duration-300`}
		>
			<div
				className={`bg-neutral-800 absolute top-0 right-0 w-full h-full sm:w-96 p-4 flex flex-col font-bold overflow-auto`}
			>
				{/* MENU */}
				<div className='gap-5 border-b-2'>
					<nav className='flex flex-col text-white py-4'>
						<ul className='text-xl'>
							{menuItems.map((link, index) => (
								<li
									key={index}
									onClick={toggleHamburger}
									className={`pt-5 pb-2 ${
										link.special && 'text-zinc-400 text-3xl'
									}`}
								>
									<Link
										className={classNames({
											'border-b-2 border-b-red-500': pathName === link.href,
										})}
										onClick={() => toggleActive(link.href)}
										href={link.href}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
				{status === 'authenticated' && (
					<div className='text-white py-4 text-xl flex items-center'>
						<LogOut className='w-8 h-8 m-4' /> <LogOutModal />
					</div>
				)}
			</div>
		</div>
	)
}
