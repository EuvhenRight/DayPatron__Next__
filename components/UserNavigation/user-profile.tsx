'use client'
import { DeliveryWithItems } from '@/lib/types/types'
import { User } from '@prisma/client'
import { useEffect, useState } from 'react'
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
	const [openProfileDialog, setOpenProfileDialog] = useState(false)
	console.log(session, 'session')
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// CHECK IF FIRST TIME VISIT
			const isFirstTime = !localStorage.getItem('visitedProfile')
			setTimeout(() => {
				if (isFirstTime) {
					localStorage.setItem('visitedProfile', 'true')

					setOpenProfileDialog(true)
				}
			}, 500) // DELAY TIME IN MILLISECONDS
		}
	}, [])

	return (
		<section className='xl:container xl:mx-auto lg:pt-5 relative px-2 flex flex-col md:flex-row'>
			<div className='w-full md:w-1/3 p-2'>
				<ProfileForm
					currentUser={currentUser}
					openProfileDialog={openProfileDialog}
					setOpenProfileDialog={setOpenProfileDialog}
				/>
			</div>
			<div className='w-full md:w-2/3 p-2'>
				<DeliveryForm currentDelivery={currentDelivery} />
			</div>
		</section>
	)
}
