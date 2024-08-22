import { TableCleanerProducts } from '@/components/Guide/guide-cleaners'
import { TableOilsProducts } from '@/components/Guide/guide-oils'
import { getAllProducts } from '@/lib/services/products'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'

async function Guide() {
	// FETCH ALL PRODUCTS
	const dataProducts = await getAllProducts()
	return (
		<section className='container'>
			<div>
				<h1 className={cn(rubikGlitch.className, 'flex justify-center')}>
					Не впевнені, які саме продукти вам потрібні?
				</h1>
				<p className='text-sm text-center flex justify-center my-10'>
					Ознайомтеся з нашою таблицею, що містить детальну інформацію про
					асортимент продукції, їх безпечність, типи забруднень, які вони
					ефективно очищують, а також можливості для безпечного зберігання та
					догляду за вашою зброєю.
				</p>
			</div>
			<TableOilsProducts products={dataProducts} />
			<TableCleanerProducts products={dataProducts} />
		</section>
	)
}

export default Guide
