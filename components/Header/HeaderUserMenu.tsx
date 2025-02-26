'use client'
import { LogOutModal } from '@/components/SignOut/sign-out'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from '@/components/ui/menubar'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export const UserMenu = () => {
	const { data: session } = useSession()
	const role = session?.user?.role
	const currentName = session?.user?.name?.charAt(0)

	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger className='cursor-pointer bg-white p-0'>
					<Avatar>
						<AvatarImage src={session?.user?.image!} />
						{/* NAME OF USER */}
						<AvatarFallback>{currentName ? currentName : 'U'}</AvatarFallback>
					</Avatar>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem asChild className='cursor-pointer'>
						{/* CONDITION IF USER IS ADMIN */}
						{role === 'ADMIN' ? (
							<Link href='/admin/dashboard'>Адмін</Link>
						) : (
							<Link href='/dashboard/profile'>
								Профіль: {session?.user?.name}
							</Link>
						)}
					</MenubarItem>
					<MenubarItem onSelect={event => event.preventDefault()}>
						{/* LOGOUT */}
						<LogOutModal />
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}
