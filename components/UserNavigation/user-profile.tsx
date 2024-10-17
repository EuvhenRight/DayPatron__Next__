'use client'
import { sentTest } from '@/lib/services/email-template'
import { DeliveryWithItems } from '@/lib/types/types'
import { User } from '@prisma/client'
import { Button } from '../ui/button'
import { DeliveryForm } from './delivery-form'
import { ProfileForm } from './profile-form'

interface Props {
	currentUser: User
	currentDelivery: DeliveryWithItems | null
	session: any
}
export const UserProfile = ({
	currentUser,
	currentDelivery,
	session,
}: Props) => {
	const sessionClik = async () => await sentTest()
	return (
		<section className='xl:container xl:mx-auto lg:pt-5 relative px-2 flex flex-col md:flex-row'>
			<div className='w-full md:w-1/3 p-2'>
				<ProfileForm currentUser={currentUser} />
			</div>
			<div className='w-full md:w-2/3 p-2'>
				<DeliveryForm currentDelivery={currentDelivery} />
			</div>
			<div>
				<Button onClick={() => sessionClik()}>Click</Button>
			</div>
		</section>
	)
}
