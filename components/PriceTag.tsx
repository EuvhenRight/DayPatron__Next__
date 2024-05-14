import { formatPrice } from '@/lib/db/format'

interface PriceTagProps {
	price: number
}
export const PriceTag: React.FC<PriceTagProps> = ({ price }) => {
	return <span>{formatPrice(price)}</span>
}
