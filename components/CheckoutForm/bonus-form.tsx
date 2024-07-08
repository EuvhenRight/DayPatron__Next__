import { AccordionItem } from '@radix-ui/react-accordion'
import { Accordion, AccordionContent, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const BonusForm = () => {
	return (
		<Accordion type='single' collapsible>
			<AccordionItem value='bonus'>
				<AccordionTrigger>
					<p className='font-bold text-md'>Ввести промокод</p>
				</AccordionTrigger>
				<AccordionContent>
					<div className='flex flex-col gap-2 m-1'>
						<Input placeholder='Промокод' className='p-2' />
						<Button type='button' variant='default' className='mt-3'>
							Застосувати
						</Button>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}

export default BonusForm
