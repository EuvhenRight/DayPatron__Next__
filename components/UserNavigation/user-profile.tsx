'use client'
import { DeliveryWithItems } from '@/lib/types/types'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { DeliveryForm } from './delivery-form'
import { ProfileForm } from './profile-form'

interface Props {
	currentUser: User
	currentDelivery: DeliveryWithItems | null
}
export const UserProfile = ({ currentUser, currentDelivery }: Props) => {
	const route = useRouter()

	return (
		<section className='xl:container xl:mx-auto lg:pt-5 relative px-2 flex'>
			<div className='w-1/3 p-2'>
				<ProfileForm currentUser={currentUser} />
			</div>
			<div className='w-2/3 p-2'>
				<DeliveryForm currentDelivery={currentDelivery} />
			</div>
		</section>
	)
}
