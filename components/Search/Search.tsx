'use client'
import { Input } from '@/components/ui/input'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet'
import { useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'

export const SearchDialog = () => {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')

	const handleSearch = () => {
		setOpen(true)
	}

	return (
		<div>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						className='w-8 h-8 cursor-pointer text-white'
						onClick={handleSearch}
					>
						<AiOutlineSearch className='w-full h-full' />
					</button>
				</SheetTrigger>
				<SheetContent side='top' className='h-full max-w-full bg-neutral-200'>
					<div className='flex flex-row items-center justify-between'>
						<h1 className='text-xl font-bold'>Пошук</h1>
						<SheetClose
							asChild
							className='w-6 h-6 cursor-pointer hover:text-neutral-500'
						>
							<AiOutlineClose />
						</SheetClose>
					</div>
					<div className='mt-4'>
						Будь ласка, введіть назву товару що ви шукаєте...
						<Input
							type='text'
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder='Введіть назву...'
							className='mt-2'
						/>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
