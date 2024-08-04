import { useSession } from 'next-auth/react'

export const CurrentUser = () => {
	const session = useSession()

	return session?.data?.user
}
