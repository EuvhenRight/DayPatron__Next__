import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { CircleHelp } from 'lucide-react'

interface Props {
	text: string
}

export const TooltipInfo = ({ text }: Props) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<CircleHelp className='ml-1 text-green-500' />
				</TooltipTrigger>
				<TooltipContent>
					<p className='text-sm w-60'>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
