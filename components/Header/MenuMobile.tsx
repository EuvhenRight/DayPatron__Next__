'use client'
import classNames from 'classnames'
import { LogOut } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { memo } from 'react'
import { AiOutlineFacebook } from 'react-icons/ai'
import { BiLogoTelegram } from 'react-icons/bi'
import { LogOutModal } from '../SignOut/sign-out'

interface MenuMobileProps {
	isActive: string
	isOpenMenu: boolean
	toggleHamburger: () => void
	toggleActive: (href: string) => void
}
export const MenuMobile: React.FC<MenuMobileProps> = memo(
	({ isOpenMenu, toggleHamburger, toggleActive, isActive }) => {
		const pathName = usePathname()
		const { data: session, status } = useSession()
		const router = useRouter()

		// NAME OF USER
		const currentName =
			session?.user?.name === null ? 'Account' : session?.user?.name

		const currenRole = session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard'

		const menuItems = [
			{ label: 'Home', href: '/' },
			{ label: 'Products', href: '/products' },
			{ label: 'About', href: '/about' },
			{ label: 'Where to Buy', href: '/where-to-buy' },
			{ label: 'Contacts', href: '/contacts' },
			session
				? { label: currentName, href: currenRole, special: true }
				: { label: 'Login', href: 'auth/register' },
		]

		return (
			<div
				className={`fixed top-0 left-0 right-0 bottom-0 w-full h-full z-20 ${
					isOpenMenu ? 'translate-x-0' : 'translate-x-full'
				} ease-in-out duration-300`}
			>
				<div
					className={`bg-neutral-700 absolute top-0 right-0 h-full w-full sm:w-96 p-4 flex flex-col font-bold overflow-auto`}
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
												'border-b-2 border-b-red-500':
													isActive === link.href || pathName === link.href,
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
						<button className='text-white py-4 text-xl flex items-center'>
							<LogOut className='w-8 h-8 m-4' /> <LogOutModal />
						</button>
					)}
					{/* ICONS MENU */}
					<div className='flex flex-row text-white py-4 justify-end'>
						<button onClick={toggleHamburger}>
							<BiLogoTelegram className='w-8 h-8 m-4' />
						</button>
						<button onClick={toggleHamburger}>
							<AiOutlineFacebook className='w-8 h-8 m-4' />
						</button>
					</div>
				</div>
			</div>
		)
	}
)
