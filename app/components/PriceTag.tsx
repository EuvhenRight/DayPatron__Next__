import { formatPrice } from '../lib/db/format'

const PriceTag = ({ price }: { price: number }) => {
	return <span>{formatPrice(price)}</span>
}

export default PriceTag
