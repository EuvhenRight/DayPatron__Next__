'use client'
import { ValidationSchema } from '@/lib/db/validation'
import { useState } from 'react'
import { z } from 'zod'
import { Label } from '../ui/label'
import { ExtraUserDialog } from './extra-user-dialog'

interface Props {
	onChange?: () => void
}
export const ExtraUserForm = ({ onChange }: Props) => {
	const [extraUser, setExtraUser] =
		useState<z.infer<typeof ValidationSchema.extraUser>>()

	return (
		<div className='border p-2 border-spacing-1 rounded-md my-4'>
			<div className='flex justify-between'>
				<h2 className='font-bold text-xl px-2 text-end mt-2'>
					Додатковий отримувач
				</h2>
				<ExtraUserDialog onChange={onChange} setExtraUser={setExtraUser} />
			</div>
			<div className='space-y-4 pt-4'>
				<div>
					<Label className='px-3 font-bold'>Ім&apos;я:</Label>
					{extraUser?.firstName}
				</div>
				<div>
					<Label className='px-3 font-bold'>Прізвище:</Label>
					{extraUser?.lastName}
				</div>
				<div>
					<Label className='px-3 font-bold'>Номер телефону:</Label>
					{extraUser?.phone}
				</div>
				<div>
					<Label className='px-3 font-bold'>Пошта:</Label>
					{extraUser?.email}
				</div>
			</div>
		</div>
	)
}
