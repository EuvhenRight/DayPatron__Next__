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

export const UserMenu: React.FC = () => {
	const { data: session } = useSession()
	const role = session?.user?.role
	const currentName = session?.user?.name?.charAt(0)

	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>
					<Avatar>
						<AvatarImage src={session?.user?.image!} />
						<AvatarFallback>{currentName ? currentName : 'U'}</AvatarFallback>
					</Avatar>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						{role === 'ADMIN' ? (
							<Link href='/admin'>Admin</Link>
						) : (
							<Link href='/dashboard'>Dashboard</Link>
						)}
					</MenubarItem>
					<MenubarItem onSelect={event => event.preventDefault()}>
						<LogOutModal />
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}
