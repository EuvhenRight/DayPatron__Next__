'use client'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Textarea } from '@/components/ui/textarea'
import { AccordionHeader } from '@radix-ui/react-accordion'
import { useState } from 'react'
import { Label } from '../ui/label'
export const CommentForm = () => {
	// INITIAL STATE FOR TEXTAREA
	const [comment, setComment] = useState('')
	const [isOpen, setIsOpen] = useState(true)

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value)
	}

	// HANDLERS
	const toggleAccordion = () => {
		setIsOpen(!isOpen)
	}
	return (
		<div className='border p-2 border-spacing-1 rounded-md my-4 relative'>
			<Accordion type='single' collapsible>
				<AccordionItem value='item-1 w-full'>
					<AccordionHeader asChild>
						<AccordionTrigger onClick={toggleAccordion}>
							<div className='font-bold flex flex-col text-left'>
								Коментар до замовлення
								{isOpen && <Label>{comment}</Label>}
							</div>
						</AccordionTrigger>
					</AccordionHeader>
					<AccordionContent className='p-2'>
						<Textarea
							id='comment'
							onChange={handleTextareaChange}
							value={comment}
							placeholder='Type your message here.'
							maxLength={250}
						/>
						<p className='text-right text-neutral-500 text-sm py-1'>
							Залишилось символів:{250 - comment.length}
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}
