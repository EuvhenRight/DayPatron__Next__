import { TableCleanerProducts } from '@/components/Guide/guide-cleaners'
import { TableOilsProducts } from '@/components/Guide/guide-oils'
import { SpecificationCard } from '@/components/Guide/specification-card'
import { getAllProducts } from '@/lib/services/products'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'

async function Guide() {
	// FETCH ALL PRODUCTS
	const dataProducts = await getAllProducts()
	return (
		<section className='container'>
			<div className='text-center pt-1'>
				<h1
					className={cn(
						rubikGlitch.className,
						'text-xl md:text-3xl font-black my-14 text-center uppercase text-neutral-800'
					)}
				>
					Не впевнені, які саме продукти вам потрібні?
				</h1>
				<h2 className='text-sm text-center flex justify-center my-10'>
					Основні характеристики та спеціфікація допожуть вам швидко знайти
					потрібний продукт
				</h2>
				<SpecificationCard />
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
