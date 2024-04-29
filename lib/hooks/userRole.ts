import { useSession } from 'next-auth/react'

const UserCurrentRole = () => {
	const session = useSession()

	return session?.data?.user?.role
}

export default UserCurrentRole
