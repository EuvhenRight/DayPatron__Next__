import { useSession } from 'next-auth/react'

const CurrentUser = () => {
	const session = useSession()

	return session?.data?.user
}

export default CurrentUser
