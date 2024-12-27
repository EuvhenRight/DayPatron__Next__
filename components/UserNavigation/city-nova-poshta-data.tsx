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
import { useSearchCityData } from '@/lib/hooks/search'
import { cn } from '@/lib/utils/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
	onChange: (value: string) => void
	setAutoCityData: (value: string) => void
}

export const ComboboxCityData = ({ onChange, setAutoCityData }: Props) => {
	const [open, setOpen] = useState<boolean>(false)
	const [currentData, setCurrentData] = useState<string | null>(null)
	const [searchCity, setSearchCity] = useState('')
	// GET DATA FROM API
	const { cityName, loading } = useSearchCityData(searchCity)
	const handleOnChange = (value: string) => {
		setSearchCity(value)
	}

	const handleOnSelect = (currentValue: string) => {
		const selectedItem = cityName?.find(
			item =>
				`${item.SettlementTypeDescription} ${item.Description} ${item.AreaDescription}` ===
				currentValue
		)
		if (selectedItem) {
			setCurrentData(currentValue === currentData ? '' : currentValue)
			setAutoCityData(
				currentValue === currentData ? '' : selectedItem.Description
			)
		}
		setOpen(false)
	}

	useEffect(() => {
		onChange(currentData || '')
	}, [currentData, onChange, cityName])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<div className='relative w-full'>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='w-full justify-between whitespace-pre-line'
					>
						{currentData ? `${currentData} обл.` : 'Місто для доставки'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					side='bottom'
					align='start'
					sideOffset={5}
					className='p-0 md:w-[700px] h-48 md:h-[300px] data-[side=bottom]:animate-slideDown'
				>
					<Command className='bg-gray-200'>
						<CommandInput
							value={searchCity || ''}
							onValueChange={handleOnChange}
						/>
						<CommandList>
							<CommandEmpty>Нічого не знайдено</CommandEmpty>
							<CommandGroup>
								{cityName?.map((item, index) => (
									<CommandItem
										className='cursor-pointer'
										key={index}
										value={`${item.SettlementTypeDescription} ${item.Description} ${item.AreaDescription}`}
										onSelect={handleOnSelect}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												currentData === item.Ref ? 'opacity-100' : 'opacity-0'
											)}
										/>
										<span className='ml-1 font-bold'>
											{item.SettlementTypeDescription} {item.Description}
										</span>
										<span className='ml-1'>
											{item.RegionsDescription}
											{item.RegionsDescription && ' р-н'}
										</span>
										<span className='ml-1'>{item.AreaDescription} обл.</span>
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
