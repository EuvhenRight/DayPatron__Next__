import { formatPriceUa } from '@/lib/db/format'

interface Props {
	price: number
}
export const PriceTag = ({ price }: Props) => {
	return <span>{formatPriceUa(price)}</span>
}
