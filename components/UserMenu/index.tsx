import { useSession } from 'next-auth/react'
import Link from 'next/link'

const UserMenu: React.FC = () => {
	const { data: session } = useSession()
	const CurrentName = session?.user?.name?.charAt(0)

	return (
		<div className='dropdown dropdown-end'>
			<div
				tabIndex={0}
				role='button'
				className='btn btn-ghost btn-circle avatar placeholder'
			>
				<div className='bg-neutral text-neutral-content rounded-full w-10'>
					<span className='text-lg'>{CurrentName ? CurrentName : 'U'}</span>
				</div>
			</div>
			<ul
				tabIndex={0}
				className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
			>
				<li>
					<Link href='/dashboard'>Dashboard</Link>
				</li>
				<li>
					<Link href={'/api/auth/signout?callbackUrl=/'}>Logout</Link>
				</li>
			</ul>
		</div>
	)
}

export default UserMenu
