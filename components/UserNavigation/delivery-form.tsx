import { DeliveryFormDialog } from '@/components/UserNavigation/delivery-form-dialog'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { DeliveryWithItems } from '@/lib/types/types'
import { User } from '@prisma/client'
import Image from 'next/image'
import { useState } from 'react'
import { DeliveryFormEditDialog } from './delivery-form-edit-dialog'

interface Props {
	currentUser: User
	currentDelivery: DeliveryWithItems | null
}

export const DeliveryForm = ({ currentUser, currentDelivery }: Props) => {
	const [typeOfDelivery, setTypeOfDelivery] = useState<string>('')

	return (
		<div className='border p-2 border-spacing-1 rounded-md'>
			<div className='flex justify-between'>
				<h2 className='font-bold text-xl px-2 mt-2 text-end'>Доставка</h2>
				<DeliveryFormDialog
					setTypeOfDelivery={setTypeOfDelivery}
					typeOfDelivery={typeOfDelivery}
				/>
			</div>
			{currentDelivery?.items.length! > 0 ? (
				<div>
					<Accordion type='single' collapsible className='p-2'>
						{currentDelivery?.items.map(item => (
							<AccordionItem
								key={item.id}
								value={item.id}
								className='w-full bg-zinc-100 rounded-md px-2 mt-2'
							>
								<AccordionTrigger>
									<div>
										{item.typeOfDelivery.toUpperCase()}
										{item.typeOfDelivery === 'У відділення' ? (
											<Image
												src='/images/logoNP.svg'
												width={150}
												height={50}
												alt='logo'
											/>
										) : (
											<p>{item.city}</p>
										)}
									</div>
								</AccordionTrigger>
								<AccordionContent className='space-y-4 pt-4'>
									<div className='flex justify-between'>
										<div>
											<Label className='px-3 font-bold'>Тип доставки:</Label>
											{item.typeOfDelivery}
										</div>
										<DeliveryFormEditDialog
											item={item}
											setTypeOfDelivery={setTypeOfDelivery}
											typeOfDelivery={typeOfDelivery}
										/>
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
