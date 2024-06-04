import { formatCurrency } from '@/lib/formatPrice'

interface Props {
	price: number
}
export const PriceTag = ({ price }: Props) => {
	return <span>{formatCurrency(price)}</span>
}
