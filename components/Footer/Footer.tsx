'use client'
import { Product } from '@prisma/client'
import Image from 'next/image'
import { FooterInformation } from './footer-information'
import { LinkFooterProducts } from './link-footer-products'

interface Props {
	products: Product[]
}
const Footer = ({ products }: Props) => {
	return (
		<footer className='bg-neutral-800 z-40 mt-10'>
			<div className='flex flex-row justify-center gap-4'>
				<div className='relative'>
					<Image
						src='/images/DayLogo_footer.svg'
						alt='logo'
						priority={true}
						width={200}
						height={50}
					/>
				</div>
				<LinkFooterProducts products={products} />
				<FooterInformation />
			</div>
			<p className='py-6 text-white text-sm text-center border-t border-t-white'>
				© 2023 DayPatron Inc. Усі права захищені
			</p>
		</footer>
	)
}

export default Footer
