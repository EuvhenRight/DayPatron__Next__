import { TableCleanerProducts } from '@/components/Guide/guide-cleaners'
import { TableOilsProducts } from '@/components/Guide/guide-oils'
import { SpecificationCard } from '@/components/Guide/specification-card'
import { VideoLibrary } from '@/components/Guide/video-lybrary'
import { getAllProducts } from '@/lib/services/products'
import { rubikDirt } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Metadata } from 'next'

// METADATA GENERATOR
export const metadata: Metadata = {
	title: 'Посібник для покупців DayPatron',
	description: 'Не впевнені, які саме продукти вам потрібні ❓',
	openGraph: {
		title: 'Посібник для покупців DayPatron',
		locale: 'uk-UA',
		description: 'Не впевнені, які саме продукти вам потрібні❓',
		url: `https://daypatron.com/guide`,
		type: 'website',
		images: [
			{
				url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/DayLogo_black.png`,
				width: 1200,
				height: 630,
				alt: 'Ukraine',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Посібник для покупців',
		description: 'Не впевнені, які саме продукти вам потрібні❓',
		site: 'https://daypatron.com',
		creator: 'daypatronteam',
		images: `${process.env.NEXT_PUBLIC_IMAGE_URL}/DayLogo_black.png`,
	},
}
async function Guide() {
	// FETCH ALL PRODUCTS
	const dataProducts = await getAllProducts()
	return (
		<div>
			<section className='container'>
				<div className='text-center pt-1'>
					<h1
						className={cn(
							rubikDirt.className,
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
			<VideoLibrary />
		</div>
	)
}

export default Guide
