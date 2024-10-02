import { getCurrentUser } from '@/actions/user'
import { UserProfile } from '@/components/UserNavigation/user-profile'
import { getDelivery } from '@/lib/services/delivery'
import { NextResponse } from 'next/server'

// Ensure dynamic rendering
export const dynamic = 'force-dynamic'

const UserProfilePage = async () => {
	const [currentUser, currentDelivery] = await Promise.all([
		getCurrentUser(),
		getDelivery(),
	])
	if (!currentUser) return NextResponse.redirect('/auth/register')

	return (
		<UserProfile currentUser={currentUser} currentDelivery={currentDelivery} />
	)
}

export default UserProfilePage
