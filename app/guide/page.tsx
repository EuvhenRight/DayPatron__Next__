import { AboutOfProduct } from '@/components/Guide/guide-about-of-product'
import { TableCleanerProducts } from '@/components/Guide/guide-cleaners'
import { TableOilsProducts } from '@/components/Guide/guide-oils'

const Guide = () => {
	return (
		<div className='container'>
			<div className='flex justify-center my-10'>
				<AboutOfProduct />
			</div>
			<TableOilsProducts />
			<TableCleanerProducts />
		</div>
	)
}

export default Guide
