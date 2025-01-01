import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { CircleHelp } from 'lucide-react'

export function PopoverInfo({ text }: { text: string }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<CircleHelp className='ml-1 text-green-500 cursor-pointer' />
			</PopoverTrigger>
			<PopoverContent className='w-80 text-sm'>
				<div>{text}</div>
			</PopoverContent>
		</Popover>
	)
}
