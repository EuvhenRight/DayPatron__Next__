import { UserInformation } from '@/components/UserInformation/user-information'
import { getManyOrders, getOrder } from '@/lib/services/order'

// Ensure dynamic rendering
export const dynamic = 'force-dynamic'
async function UserInformationPage() {
	const [order, orders] = await Promise.all([getOrder(), getManyOrders()])

	return (
		<div>
			<UserInformation orders={orders!} />
		</div>
	)
}

export default UserInformationPage
