import { UserNavigation } from '@/components/UserNavigation/user-nav'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div>
				<UserNavigation />
			</div>
			<div>{children}</div>
		</>
	)
}

export default UserLayout
