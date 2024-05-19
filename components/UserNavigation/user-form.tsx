import { User } from '@prisma/client'
import { Label } from '../ui/label'
import { UserFormDialog } from './user-form-dialog'

interface Props {
	currentUser: User
}

export const UserForm = ({ currentUser }: Props) => {
	return (
		<div className='border p-2 border-spacing-1 rounded-md'>
			<div className='flex justify-between'>
				<h2 className='font-bold text-xl px-2 text-end'>Ваш профіль</h2>
				<UserFormDialog currentUser={currentUser} />
			</div>
			<div className='space-y-4 pt-4'>
				<div>
					<Label className='px-3 font-bold'>Ім&apos;я:</Label>
					{currentUser.first_name}
				</div>
				<div>
					<Label className='px-3 font-bold'>Прізвище:</Label>
					{currentUser.last_name}
				</div>
				<div>
					<Label className='px-3 font-bold'>Пошта:</Label>
					{currentUser.email}
				</div>
			</div>
		</div>
	)
}
