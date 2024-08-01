'use client'
import { DeliveryFormDialog } from '@/components/UserNavigation/delivery-form-dialog'
import { DeliveryFormEditDialog } from '@/components/UserNavigation/delivery-form-edit-dialog'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { DeliveryWithItems } from '@/lib/types/types'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
	currentDelivery: DeliveryWithItems | null
}

export const DeliveryForm = ({ currentDelivery }: Props) => {
	const [typeOfDelivery, setTypeOfDelivery] = useState<string>('')

	return (
		<div className='border shadow-lg p-4 border-spacing-1 rounded-md my-4'>
			<div className='flex justify-between'>
				<h2 className='font-bold text-xl p-2 text-end'>Доставка</h2>
				{/* CREATE DELIVERY */}
				<DeliveryFormDialog
					setTypeOfDelivery={setTypeOfDelivery}
					typeOfDelivery={typeOfDelivery}
				/>
			</div>
			{/* SHOW DELIVERY FORM */}
			{currentDelivery?.items.length! > 0 ? (
				<div className='space-x-2'>
					<Accordion
						type='single'
						collapsible
						className='p-2 overflow-auto max-h-96'
					>
						{currentDelivery?.items.map(item => (
							<AccordionItem
								key={item.id}
								value={item.id}
								className='w-full bg-zinc-100 rounded-md p-2 my-4'
							>
								<AccordionTrigger>
									<div className='font-bold'>
										{item.typeOfDelivery.toUpperCase()}
										<Image
											src='/images/logoNP.svg'
											width={150}
											height={50}
											alt='logo'
										/>
									</div>
								</AccordionTrigger>
								<AccordionContent className='space-y-4 pt-4'>
									<div className='flex justify-between'>
										<div>
											<Label className='px-3 font-bold'>Тип доставки:</Label>
											{item.typeOfDelivery}
										</div>
										{/* EDIT DELIVERY */}
										<DeliveryFormEditDialog item={item} />
									</div>
									{/* SHOW DELIVERY CURRENT INFO */}
									{item.typeOfDelivery === 'У відділення' ? (
										<div className='flex flex-col px-3'>
											<Label className='py-3 font-bold'>
												Номер відділення:
											</Label>
											{item.branchNumber}
											<Label className='py-3 font-bold'>Населений пункт:</Label>
											{item.city}
										</div>
									) : (
										<>
											<div>
												<Label className='px-3 font-bold'>
													Населений пункт:
												</Label>
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
												<Label className='px-3 font-bold'>
													Поштовий індекс:
												</Label>
												{item.zipCode}
											</div>
										</>
									)}
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
