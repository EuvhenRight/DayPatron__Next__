import AdminNav from '@/components/AdminNav/admin-nav'

export const metadata = {
	title: 'DayPatron Admin',
	description: 'Admin Dashboard',
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<AdminNav />
			<div>{children}</div>
		</>
	)
}

export default AdminLayout
