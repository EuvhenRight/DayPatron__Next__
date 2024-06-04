'use client'
import { User } from '@prisma/client'
import { Label } from '../ui/label'
import { ProfileFormDialog } from './profile-form-dialog'

interface Props {
	currentUser: User
}

export const ProfileForm = ({ currentUser }: Props) => {
	return (
		<div className='border p-2 border-spacing-1 rounded-md my-4'>
			<div className='flex justify-between'>
				<h2 className='font-bold text-xl px-2 text-end mt-2'>Ваш профіль</h2>
				<ProfileFormDialog currentUser={currentUser} />
			</div>
			<div className='space-y-4 pt-4'>
				<div>
					<Label className='px-3 font-bold'>Ім&apos;я:</Label>
					{currentUser.firstName}
				</div>
				<div>
					<Label className='px-3 font-bold'>Прізвище:</Label>
					{currentUser.lastName}
				</div>
				<div>
					<Label className='px-3 font-bold'>Номер телефону:</Label>
					{currentUser.phone}
				</div>
				<div>
					<Label className='px-3 font-bold'>Пошта:</Label>
					{currentUser.email}
				</div>
			</div>
		</div>
	)
}
