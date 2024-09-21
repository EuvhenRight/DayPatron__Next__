import { createBonusCode } from '@/actions/bonus'
import { applyBonusCode } from '@/actions/bonus-code'
import { CartWithVariants } from '@/lib/types/types'
import { AccordionItem } from '@radix-ui/react-accordion'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface Props {
	cart?: CartWithVariants | null
}
const BonusForm = ({ cart }: Props) => {
	const [error, setError] = useState<string | null>(null)
	const createCode = async () => {
		try {
			const response = await createBonusCode({
				code: 'test',
				discountValue: 20,
			})
			return response
		} catch (error) {
			console.log(error)
		}
	}
	const handleSubmit = async () => {
		try {
			const response = await applyBonusCode('test', cart?.id!, cart?.userId!)

			if (!response.success) {
				setError(response.message)
			}
			return response
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<Accordion type='single' collapsible>
			<AccordionItem value='bonus'>
				<AccordionTrigger>
					<p className='font-bold text-md'>Ввести промокод</p>
				</AccordionTrigger>
				<AccordionContent>
					<div className='flex flex-col gap-2 m-1'>
						<Input placeholder='Промокод' className='p-2' />
						<Button
							type='button'
							onClick={handleSubmit}
							variant='default'
							className='mt-3'
						>
							Застосувати
						</Button>
						<Button onClick={createCode} type='button'>
							Створити промокод
						</Button>
						{error && <p className='text-red-500'>{error}</p>}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}

export default BonusForm
