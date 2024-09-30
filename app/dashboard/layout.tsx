import { UserNavigation } from '@/components/UserNavigation/user-nav'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<UserNavigation />
			<div>{children}</div>
		</div>
	)
}

export default UserLayout
