'use client'
import { Label } from '../ui/label'
import { ExtraUserDialog } from './extra-user-dialog'

interface Props {
	onChange?: () => void
}
export const ExtraUserForm = ({ onChange }: Props) => {
	return (
		<div className='border p-2 border-spacing-1 rounded-md my-4'>
			<div className='flex justify-between'>
				<h2 className='font-bold text-xl px-2 text-end mt-2'>
					Додатковий отримувач
				</h2>
				<ExtraUserDialog onChange={onChange} />
			</div>
			<div className='space-y-4 pt-4'>
				<div>
					<Label className='px-3 font-bold'>Ім&apos;я:</Label>
				</div>
				<div>
					<Label className='px-3 font-bold'>Прізвище:</Label>
				</div>
				<div>
					<Label className='px-3 font-bold'>Номер телефону:</Label>
				</div>
				<div>
					<Label className='px-3 font-bold'>Пошта:</Label>
				</div>
			</div>
		</div>
	)
}
