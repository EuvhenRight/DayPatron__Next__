'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from '@/components/ui/menubar'
import { useLogOut } from '@/lib/hooks/useLogout'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const UserMenu: React.FC = () => {
	const { isModalOpen, handleOpen } = useLogOut()
	const { data: session } = useSession()
	const role = session?.user?.role
	const CurrentName = session?.user?.name?.charAt(0)
	const router = useRouter()
	const handleOut = () => {
		signOut()
		router.push('/')
	}
	return (
		<div className='dropdown dropdown-end'>
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>
						<Avatar>
							<AvatarImage src={session?.user?.image!} />
							<AvatarFallback>{CurrentName ? CurrentName : 'U'}</AvatarFallback>
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
						<MenubarItem>
							<button onClick={handleOut}>SignOut</button>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</div>
	)
}

export default UserMenu
