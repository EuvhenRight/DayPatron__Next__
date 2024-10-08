import { UserProfile } from '@/components/UserNavigation/user-profile'
import { getDelivery } from '@/lib/services/delivery'
import { getCurrentSession, getCurrentUser } from '@/lib/services/user'
import { NextResponse } from 'next/server'

// Ensure dynamic rendering
export const dynamic = 'force-dynamic'

const UserProfilePage = async () => {
	const [currentUser, currentDelivery, session] = await Promise.all([
		getCurrentUser(),
		getDelivery(),
		getCurrentSession(),
	])
	if (!currentUser) return NextResponse.redirect('/auth/register')

	return (
		<UserProfile
			currentUser={currentUser}
			currentDelivery={currentDelivery}
			session={session}
		/>
	)
}

export default UserProfilePage
