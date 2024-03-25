import { getCurrentUser } from '@/actions/getCurrentUser'
import UserProfileForm from '@/components/UserNav/user-profile-form'
import { NextResponse } from 'next/server'

const UserProfilePage = async () => {
	const currentUser = await getCurrentUser()
	if (!currentUser) return NextResponse.redirect('/auth/login')

	return <UserProfileForm currentUser={currentUser} />
}

export default UserProfilePage
