import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DeliveryFormEditDialog } from '@/components/UserNavigation/delivery-form-edit-dialog'
import { DeliveryWithItems } from '@/lib/types/types'
import { Asterisk } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { DeliveryFormDialog } from '../UserNavigation/delivery-form-dialog'

interface Props {
	onChange: (value: string) => void
	currentDelivery: DeliveryWithItems | null
}

export const DeliveryForm = ({ onChange, currentDelivery }: Props) => {
	const [typeOfDelivery, setTypeOfDelivery] = useState<string>('')

	const toggleOnDelivery = (id: string) => {
		const findItem = currentDelivery?.items.find(item => item.id === id)
		if (findItem) {
			onChange(findItem.id)
		}
	}
	return (
		<div className='border p-2 border-spacing-1 rounded-md my-4 relative overflow-auto max-h-64'>
			<RadioGroup
				onValueChange={toggleOnDelivery}
				className='mb-2 flex flex-col gap-1'
			>
				<div className='flex justify-between'>
					<div className='flex items-center'>
						<h2 className='font-bold text-lg px-2 mt-2 text-end'>Доставка</h2>
						<Asterisk size={16} className='text-red-500' />
					</div>
					{/* CREATE DELIVERY */}
					<DeliveryFormDialog
						setTypeOfDelivery={setTypeOfDelivery}
						typeOfDelivery={typeOfDelivery}
					/>
				</div>
				{currentDelivery?.items.length! > 0 ? (
					currentDelivery?.items.map((item, index) => (
						<div key={index} className='flex items-center space-x-2'>
							<RadioGroupItem
								key={index}
								value={item.id} // Pass item object as a string
								onClick={() => toggleOnDelivery(item.id)}
								id={`r${index}`}
							/>
							<Accordion type='single' collapsible className='p-2 w-full'>
								<AccordionItem
									value={item.id}
									className='bg-zinc-100 rounded-md px-2 mt-2'
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
									<AccordionContent>
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
											<div>
												<Label className='px-3 font-bold'>
													Номер відділення:
												</Label>
												{item.branchNumber}
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
							</Accordion>
						</div>
					))
				) : (
					<div>
						<p className='text-center text-sm m-4'>Немає доставок</p>
					</div>
				)}
			</RadioGroup>
		</div>
	)
}
