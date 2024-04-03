import { useSession } from 'next-auth/react'

const userCurrentRole = () => {
	const session = useSession()

	return session?.data?.user?.role
}

export default userCurrentRole
