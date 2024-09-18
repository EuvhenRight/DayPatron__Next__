'use client'
import { Label } from '@/components/ui/label'
import { User } from '@prisma/client'
import { Asterisk } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ProfileFormDialog } from './profile-form-dialog'

interface Props {
	currentUser: User
	onChange?: () => void
	openProfileDialog?: boolean
	setOpenProfileDialog: (value: boolean) => void
}

export const ProfileForm = ({
	currentUser,
	onChange,
	openProfileDialog,
	setOpenProfileDialog,
}: Props) => {
	const pathName = usePathname()
	return (
		<div className='border p-4 border-spacing-1 rounded-md my-2 shadow-lg'>
			<div className='flex justify-between'>
				<div className='flex items-center'>
					<h2 className='font-bold text-lg text-end p-2'>Ваш профіль</h2>
					{pathName === '/checkouts' && (
						<Asterisk size={16} className='text-red-500' />
					)}
				</div>
				<ProfileFormDialog
					openProfileDialog={openProfileDialog!}
					onChange={onChange}
					currentUser={currentUser}
					setOpenProfileDialog={setOpenProfileDialog}
				/>
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
