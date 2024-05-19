import { getCurrentUser } from '@/actions/user'
import { UserProfile } from '@/components/UserNavigation/user-profile'
import { NextResponse } from 'next/server'

const UserProfilePage = async () => {
	const currentUser = await getCurrentUser()
	if (!currentUser) return NextResponse.redirect('/auth/register')

	return <UserProfile currentUser={currentUser} />
}

export default UserProfilePage
