'use client'
import { Input } from '@/components/ui/input'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet'
import { useSearchMainData } from '@/lib/hooks/search'
import { useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'

export const SearchDialog = () => {
	const [open, setOpen] = useState<boolean>(false)
	const [name, setName] = useState<string>('')
	const { data, loading } = useSearchMainData(name)

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
							placeholder='Введіть назву...'
							className='mt-2'
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>
					<div>
						<>
							<ul>
								{data?.map((item, index) => (
									<li key={index} className='py-2'>
										{item.name}
									</li>
								))}
							</ul>
						</>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
