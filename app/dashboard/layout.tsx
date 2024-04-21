import { UserNav } from '@/components/UserNav/user-nav'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div>
				<UserNav />
			</div>
			<div>{children}</div>
		</>
	)
}

export default UserLayout
