import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Product } from '@prisma/client'
import Image from 'next/image'

interface Props {
	product: Product[]
}
export const GuideTooltip = ({ product }: Props) => {
	const name = product.map(product => product.name)
	const image = product.map(product => product.image[5].url)

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span>{name}</span>
				</TooltipTrigger>
				<TooltipContent>
					<p className={cn(rubikGlitch.className)}>{name}</p>
					<Image
						width={150}
						height={150}
						src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`}
						alt='tooltip'
					/>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
