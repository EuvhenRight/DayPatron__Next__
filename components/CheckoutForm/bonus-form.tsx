import { applyBonusCode } from '@/actions/bonus-code'
import {
	Accordion,
	AccordionContent,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ValidationSchema } from '@/lib/db/validation'
import { CartWithVariants } from '@/lib/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { AccordionItem } from '@radix-ui/react-accordion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
	cart?: CartWithVariants | null
}
export const BonusForm = ({ cart }: Props) => {
	const [error, setError] = useState<string | null>(null)

	const form = useForm<z.infer<typeof ValidationSchema.bonusCode>>({
		resolver: zodResolver(ValidationSchema.bonusCode),
		defaultValues: {
			bonusCodeInput: '',
		},
	})
	const onSubmit = async (data: z.infer<typeof ValidationSchema.bonusCode>) => {
		try {
			const response = await toast.promise(
				applyBonusCode(data.bonusCodeInput, cart?.id!, cart?.userId!),
				{
					loading: 'Зачекаємо...',
					success: data => {
						if (data.success) {
							setError(null)
							return 'Ваш промокод успішно додано!'
						} else {
							setError(data.message)
							throw new Error(data.message)
						}
					},
					error: error => {
						console.error(error)
						return (error as Error).message
					},
				}
			)
			return response
		} catch (error) {
			console.log(error)
			setError('Щось пішло не так. Будь ласка, спробуйте знову пізніше.')
		}
	}
	return (
		<Accordion type='single' collapsible>
			<AccordionItem value='bonus'>
				<AccordionTrigger>
					<p className='font-bold text-md'>Ввести промокод</p>
				</AccordionTrigger>
				<AccordionContent>
					<Form {...form}>
						<div className='flex flex-col gap-2 m-1'>
							<FormField
								control={form.control}
								name='bonusCodeInput'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder='Промокод'
												className='p-2'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type='button'
								onClick={form.handleSubmit(onSubmit)}
								variant='default'
								className='mt-3'
							>
								Застосувати
							</Button>
						</div>
					</Form>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}
