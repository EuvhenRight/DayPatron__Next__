export const metadata = {
	title: 'DayPatron Admin',
	description: 'Admin Dashboard',
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div>Nav</div>
			<div>{children}</div>
		</>
	)
}

export default AdminLayout
