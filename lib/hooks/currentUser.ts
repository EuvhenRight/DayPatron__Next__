import { useSession } from 'next-auth/react'

const currentUser = () => {
	const session = useSession()

	return session?.data?.user
}

export default currentUser
