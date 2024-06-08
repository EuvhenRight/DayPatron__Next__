import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Wallet } from 'lucide-react'
import React from 'react'

const paymentArray = [
	{
		title: 'Карткою',
		logo: <CreditCard />,
		text: `• Без переплат\n• Захист від шахрайства\n• Повернемо гроші, якщо відмовитесь від посилки`,
		type: 'PAIMENTBYCARD',
	},
	{
		title: 'Післяплатою',
		logo: <Wallet />,
		text: '20₴ + 2% комісії',
		type: 'POSTPAID',
	},
]

interface Props {
	onChange: (value: string) => void
	payment: string
	setPayment: React.Dispatch<React.SetStateAction<string>>
}

export const PaymentForm = ({ onChange, payment, setPayment }: Props) => {
	const toggleOnDelivery = (value: string) => {
		setPayment(value)
		onChange(value)
	}
	return (
		<RadioGroup
			value={payment}
			onValueChange={toggleOnDelivery}
			className='mb-2 flex flex-col gap-1'
		>
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
							className='w-full bg-zinc-100 rounded-md px-2 mt-2'
						>
							<AccordionTrigger>
								<div className='font-bold flex flex-row text-left gap-2 '>
									{item.logo} {item.title}
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<p>
									{/* ADD TEXT <br /> */}
									{item.text.split('\n').map((line, index) => (
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
	)
}
