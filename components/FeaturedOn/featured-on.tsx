'use client'
import { FeaturedCard } from '@/components/FeaturedOn/featured-card'
import { partners } from '@/lib/services/partners'

export const FeaturedOn = () => {
	return (
		<div className='w-full flex flex-col items-center justify-center'>
			<h1 className='text-2xl font-extrabold px-4 mb-10'>ПРЕДСТАВЛЕНО</h1>
			<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center justify-items-center'>
				{partners.map((item, index) => (
					<FeaturedCard key={index} item={item} />
				))}
			</div>
		</div>
	)
}
