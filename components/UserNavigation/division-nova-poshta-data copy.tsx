'use client'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useSearchDataDivision } from '@/lib/hooks/search'
import { cn } from '@/lib/utils/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
	onChange: (value: string) => void
	autoCityData: string
}

export const ComboboxDivisionData = ({ onChange, autoCityData }: Props) => {
	const [open, setOpen] = useState<boolean>(false)
	const [currentData, setCurrentData] = useState<string>('')
	const [searchNumber, setSearchNumber] = useState('')
	// GET DATA FROM API
	const { data, loading } = useSearchDataDivision(
		searchNumber || '',
		autoCityData
	)
	const handleOnChange = (value: string) => {
		setSearchNumber(value)
	}

	const handleOnSelect = (currentValue: string) => {
		setCurrentData(currentValue === currentData ? '' : currentValue)
		setOpen(false)
	}

	useEffect(() => {
		onChange(currentData)
	}, [currentData, onChange, data, autoCityData])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<div className='relative w-full'>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						disabled={!autoCityData}
						className='w-full justify-between whitespace-pre-line'
					>
						{currentData
							? `${
									data?.find(item => item.Description === currentData)
										?.Description
							  }`
							: 'Пошук відділень можно робити по номеру, назві або за адресою'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='p-0 md:w-[700px] h-48 md:h-[300px]'>
					<Command className='bg-gray-200'>
						<CommandInput
							value={searchNumber || ''}
							onValueChange={handleOnChange}
						/>
						<CommandList>
							<CommandEmpty>Нічого не знайдено</CommandEmpty>
							<CommandGroup>
								{data?.map(item => (
									<CommandItem
										className='cursor-pointer'
										key={item.SiteKey}
										value={item.Description}
										onSelect={handleOnSelect}
										disabled={item.Description === currentData}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												currentData === item.Description
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{item.Description}
										<span className='ml-1 font-bold'>
											м. {item.CityDescription}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</div>
		</Popover>
	)
}
