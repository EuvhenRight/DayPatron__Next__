import { Label } from '@/components/ui/label'
import { User } from '@prisma/client'
import { DeliveryFormDialog } from './delivery-form-dialog'
import { RadioTypesOfDelivery } from './radio-types-of-delivery'

interface Props {
	currentUser: User
}

export const DeliveryForm = ({ currentUser }: Props) => {
	return (
		<div className='border p-2 border-spacing-1 rounded-md'>
			<div className='flex justify-between'>
				<h2 className='font-bold text-xl px-2 text-end'>Ваш профіль</h2>
				<DeliveryFormDialog currentUser={currentUser} />
			</div>
			<div className='space-y-4 pt-4'>
				<RadioTypesOfDelivery />
				<div>
					<Label className='px-3 font-bold'>Ім&apos;я:</Label>
					{currentUser.firstName}
				</div>
				<div>
					<Label className='px-3 font-bold'>Прізвище:</Label>
					{currentUser.lastName}
				</div>
				<div>
					<Label className='px-3 font-bold'>Пошта:</Label>
					{currentUser.email}
				</div>
			</div>
		</div>
	)
}
