import { formatCurrency } from '@/app/lib/formatPrice'

interface PriceTagProps {
	price: number
	className?: string
}

export function PriceTag({ price, className }: PriceTagProps) {
	return <span className={className}>{formatCurrency(price)}</span>
}
