'use client'
import { getSearch } from '@/actions/search'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet'
import { ValidationSchema } from '@/lib/db/validation'
import { ProductWithVariantsWithReviews } from '@/lib/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import { z } from 'zod'

export const SearchDialog = () => {
	const [open, setOpen] = useState<boolean>(false)
	const [data, setData] = useState<ProductWithVariantsWithReviews[]>()
	const [searchTerm, setSearchTerm] = useState<string>('')

	const handleSearch = () => {
		setOpen(true)
	}

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth', // Optional: for smooth scrolling
		})
	}, [open])

	const form = useForm<z.infer<typeof ValidationSchema.searchInput>>({
		resolver: zodResolver(ValidationSchema.searchInput),
		defaultValues: {
			inputData: '',
		},
	})
	const highlightSearchTerm = (text: string, searchTerm: string) => {
		if (!searchTerm) return text
		const regex = new RegExp(`(${searchTerm})`, 'gi')
		return text.replace(regex, '<span class="bg-yellow-200">$1</span>')
	}

	const onSubmit = async (
		value: z.infer<typeof ValidationSchema.searchInput>
	) => {
		setSearchTerm(value.inputData) // Save the search term
		try {
			const search = (await getSearch(
				value.inputData
			)) as ProductWithVariantsWithReviews[]
			setData(search)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='relative'>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						className='w-8 h-8 cursor-pointer text-white'
						onClick={handleSearch}
					>
						<AiOutlineSearch className='w-full h-full' />
					</button>
				</SheetTrigger>
				<SheetContent
					side='top'
					className='h-full max-w-full w-full bg-neutral-200 absolute z-10 p-3'
				>
					<div className='flex flex-row items-center justify-between my-8 container'>
						<h1 className='text-2xl font-bold'>Пошук</h1>
						<SheetClose
							asChild
							className='w-6 h-6 cursor-pointer hover:text-neutral-500'
						>
							<AiOutlineClose />
						</SheetClose>
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='md:w-2/3 flex gap-2 justify-start container'
						>
							<FormField
								control={form.control}
								name='inputData'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormControl>
											<Input
												type='text'
												placeholder='Будь ласка, введіть назву товару що ви шукаєте...'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type='submit'
								variant={'outline'}
								className='hover:border-red-600 hover:text-red-600'
							>
								<Search />
							</Button>
						</form>
					</Form>
					<div className='container'>
						{data?.length! > 0 ? (
							<ul>
								{data?.map((item, index) => (
									<li key={index} className='py-2'>
										<Link
											href={`/products/${item.id}/details`}
											onClick={() => setOpen(false)}
										>
											<div
												dangerouslySetInnerHTML={{
													__html: highlightSearchTerm(item.name, searchTerm),
												}}
											/>
											<div
												dangerouslySetInnerHTML={{
													__html: highlightSearchTerm(
														item.description,
														searchTerm
													),
												}}
											/>
										</Link>
									</li>
								))}
							</ul>
						) : (
							<p className='text-sm mt-6'>Нічого не знайдено</p>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
