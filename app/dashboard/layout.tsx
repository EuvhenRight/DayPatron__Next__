import UserNav from '@/components/UserNav/UserNav'

export const metadata = {
	title: 'DayPatron Dashboard',
	description: 'User Dashboard',
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div>
				<UserNav />
			</div>
			<div>{children}</div>
		</>
	)
}

export default AdminLayout
