import { DeliveryFormDialog } from '@/components/UserNavigation/delivery-form-dialog'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { User } from '@prisma/client'
import { useState } from 'react'
import { DeliveryFormEditDialog } from './delivery-form-edit-dialog'

interface Props {
	currentUser: User
}

const FakeData = [
	{
		id: 0,
		deliveryType: "Кур'єром",
		branchNumber: null,
		city: 'Київ',
		street: 'Шевченка',
		houseNumber: 46,
		apartmentNumber: 234,
		additionNumber: 'H',
		zipCode: '01001',
	},
	{
		id: 1,
		deliveryType: 'У відділення',
		branchNumber: '12232Nava',
		city: null,
		street: null,
		houseNumber: null,
		apartmentNumber: null,
		additionNumber: null,
		zipCode: null,
	},
]

export const DeliveryForm = ({ currentUser }: Props) => {
	const [typeOfDelivery, setTypeOfDelivery] = useState<string>('У відділення')

	return (
		<div className='border p-2 border-spacing-1 rounded-md'>
			<div className='flex justify-between'>
				<h2 className='font-bold text-xl px-2 mt-2 text-end'>Доставка</h2>
				<DeliveryFormDialog
					currentUser={currentUser}
					setTypeOfDelivery={setTypeOfDelivery}
					typeOfDelivery={typeOfDelivery}
				/>
			</div>
			{FakeData.length > 0 ? (
				<div>
					<Accordion type='multiple' className='p-2'>
						{FakeData.map(item => (
							<AccordionItem
								key={item.id}
								value={item.deliveryType}
								className='w-full bg-zinc-200 rounded-md px-2 mt-2'
							>
								<AccordionTrigger>{item.deliveryType}</AccordionTrigger>
								<AccordionContent className='space-y-4 pt-4'>
									<div className='flex justify-between'>
										<div>
											<Label className='px-3 font-bold'>Тип доставки:</Label>
											{item.deliveryType}
										</div>
										<DeliveryFormEditDialog />
									</div>
									<div>
										<Label className='px-3 font-bold'>Номер відділення:</Label>
										{item.branchNumber}
									</div>
									<div>
										<Label className='px-3 font-bold'>Населений пункт:</Label>
										{item.city}
									</div>
									<div>
										<Label className='px-3 font-bold'>Вулиця:</Label>
										{item.street}
									</div>
									<div>
										<Label className='px-3 font-bold'>Будинок:</Label>
										{item.houseNumber}
									</div>
									<div>
										<Label className='px-3 font-bold'>Квартира:</Label>
										{item.apartmentNumber}
									</div>
									<div>
										<Label className='px-3 font-bold'>
											Додаткова літера будинку:
										</Label>
										{item.additionNumber}
									</div>
									<div>
										<Label className='px-3 font-bold'>Поштовий індекс:</Label>
										{item.zipCode}
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			) : (
				<div>
					<p className='text-center text-sm m-4'>Немає доставок</p>
				</div>
			)}
		</div>
	)
}
