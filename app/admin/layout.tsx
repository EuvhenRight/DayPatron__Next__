import { getCurrentUser } from '@/actions/user'
import { AdminNav } from '@/components/AdminNav/admin-nav'

export const metadata = {
	title: 'DayPatron Admin',
	description: 'Admin Dashboard',
}

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const currentUser = await getCurrentUser()
	if (currentUser?.role !== 'ADMIN')
		return (
			<p className='flex justify-center items-center font-semibold h-full'>
				You do not have permission to access ADMIN page
			</p>
		)
	return (
		<>
			<AdminNav />
			<div>{children}</div>
		</>
	)
}

export default AdminLayout
