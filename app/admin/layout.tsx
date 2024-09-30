import { AdminNav } from '@/components/AdminNav/admin-nav'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<AdminNav />
			<div>{children}</div>
		</div>
	)
}

export default AdminLayout
