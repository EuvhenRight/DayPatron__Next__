import { getCurrentUser } from '@/actions/user'

const AdminDashboard = async () => {
	const currentUser = await getCurrentUser()

	if (currentUser?.role !== 'ADMIN')
		return (
			<p className='flex justify-center items-center font-semibold h-full'>
				You do not have permission to access ADMIN page
			</p>
		)
	return <div>Dashboard</div>
}

export default AdminDashboard
