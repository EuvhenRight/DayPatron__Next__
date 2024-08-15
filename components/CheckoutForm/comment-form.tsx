'use client'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { Label } from '../ui/label'

interface Props {
	onChangeText: (value: string) => void
}
export const CommentForm = ({ onChangeText }: Props) => {
	// INITIAL STATE FOR TEXTAREA
	const [comment, setComment] = useState<string>('')
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [active, setActive] = useState<boolean>(false)

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value)
		onChangeText(e.target.value)
		setActive(true)
		if (e.target.value.length === 0) {
			setActive(false)
		}
	}

	// HANDLERS
	const toggleAccordion = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div className='border shadow-lg p-4 border-spacing-1 rounded-md my-4 relative'>
			<Accordion type='single' collapsible className='p-2'>
				<AccordionItem
					value='comment'
					className='w-full bg-zinc-100 rounded-md px-2'
				>
					<AccordionTrigger onClick={toggleAccordion}>
						<div className='font-bold flex flex-col text-left'>
							Коментар до замовлення
							<span className='break-words'>
								{isOpen ? <Label>{comment}</Label> : null}
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className='p-2'>
						{/* TYPE OF DELIVERY */}
						<Textarea
							id='comment'
							value={comment}
							onChange={handleTextareaChange}
							placeholder='Додати коментар'
							maxLength={250}
						/>
						<p className='text-left text-neutral-500 text-sm py-1'>
							Залишилось символів:{250 - comment.length}
						</p>
						<div className='flex justify-end mb-2'></div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}
