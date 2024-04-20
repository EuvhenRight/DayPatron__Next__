import UserNav from '@/components/UserNav/UserNav'

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
