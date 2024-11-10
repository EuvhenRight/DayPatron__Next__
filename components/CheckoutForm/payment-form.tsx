import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Payment } from '@prisma/client'
import { Asterisk, CreditCard, Wallet } from 'lucide-react'
import React from 'react'

const paymentArray = [
	{
		title: 'Карткою',
		logo: <CreditCard />,
		text: `• Без переплат\n• Захист від шахрайства\n• Повернемо гроші, якщо відмовитесь від посилки`,
		type: Payment.PAIMENTBYCARD,
	},
	{
		title: 'Післяплатою',
		logo: <Wallet />,
		text: '20₴ + 2% комісії',
		type: Payment.POSTPAID,
	},
]

interface Props {
	onChange: (value: Payment) => void
	payment?: Payment
	setPayment: React.Dispatch<React.SetStateAction<Payment | undefined>>
}

export const PaymentForm = ({ onChange, payment, setPayment }: Props) => {
	const toggleOnDelivery = (value: Payment) => {
		setPayment(value)
		onChange(value)
	}
	return (
		<div className='border shadow-lg p-4 border-spacing-1 rounded-md my-2 lg:my-0 lg:mb-4 relative'>
			<RadioGroup
				value={payment}
				onValueChange={toggleOnDelivery}
				className='mb-2 flex flex-col gap-1'
			>
				<div className='flex items-center'>
					<h2 className='font-bold text-lg text-end'>Оплата</h2>
					<Asterisk size={16} className='text-red-500' />
				</div>
				{paymentArray.map((item, index) => (
					<div key={index} className='flex items-center space-x-2'>
						<RadioGroupItem
							key={index}
							value={item.type}
							onClick={() => toggleOnDelivery(item.type)}
							id={`r${index}`}
						/>
						<Accordion type='single' collapsible className='p-2 w-full'>
							<AccordionItem
								key={index}
								value={item.type}
								className='w-full bg-zinc-100 rounded-md px-2'
							>
								<AccordionTrigger>
									<div className='font-bold flex flex-row text-left gap-2 '>
										{item.logo} {item.title}
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<p>
										{(item.text || '').split('\n').map((line, index) => (
											<React.Fragment key={index}>
												{line}
												<br />
											</React.Fragment>
										))}
									</p>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				))}
			</RadioGroup>
		</div>
	)
}
