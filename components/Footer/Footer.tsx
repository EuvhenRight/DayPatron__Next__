'use client'
import data from '@/lib/db/content.json'
import { Product } from '@prisma/client'
import { Facebook, Instagram, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../ui/accordion'
import { Button } from '../ui/button'
import { CompanyFooterInfo } from './company-info'
import { FooterInformation } from './footer-information'
import { LinkFooterProducts } from './link-footer-products'

interface Props {
	products: Product[]
}
const Footer = ({ products }: Props) => {
	const { ContentFooter } = data
	return (
		<footer className='bg-neutral-800 z-40 mt-10'>
			<div className='flex flex-col-reverse md:flex-row justify-between md:gap-4 px-3 container items-center'>
				{/* LOGO AND SLOGAN */}
				<div className='relative flex flex-col -center py-4 md:pt-10'>
					<Image
						src='/images/DayLogo_footer.svg'
						alt='logo'
						priority={true}
						width={200}
						height={50}
					/>
					<p className='text-white text-ld py-2 italic ml-6'>
						{ContentFooter.slogan}
					</p>
					{/* SOCIAL ICONS AND LINKS */}
					<div className='flex gap-4'>
						<Button
							variant={'outline'}
							className='hover:border-red-600 hover:text-red-600 hover:translate-y-1 transition-all'
						>
							{/* TELEGRAM */}
							<Link target='_blank' href={'https://t.me/+x_wXRWsDHkk0Mzgy'}>
								<Send />
							</Link>
						</Button>
						<Button
							variant={'outline'}
							className='hover:border-red-600 hover:text-red-600 hover:translate-y-1 transition-all'
						>
							{/* FACEBOOK */}
							<Link
								target='_blank'
								href={
									'https://www.facebook.com/groups/1521928711901483/?mibextid=oMANbw'
								}
							>
								<Facebook />
							</Link>
						</Button>
						<Button
							variant={'outline'}
							className='hover:border-red-600 hover:text-red-600 hover:translate-y-1 transition-all'
						>
							{/* INSTAGRAM */}
							<Link
								target='_blank'
								href={'https://www.instagram.com/day.patron/'}
							>
								<Instagram />
							</Link>
						</Button>
					</div>
				</div>
				<div className='md:flex md:flex-row justify-center flex-col gap-4 *:text-center w-full md:w-2/3 hidden'>
					<div className='w-full md:w-1/3'>
						<LinkFooterProducts products={products} />
					</div>
					<div className='w-full md:w-1/3'>
						<FooterInformation />
					</div>
					<div className='w-full md:w-1/3'>
						<CompanyFooterInfo />
					</div>
				</div>
				<Accordion
					type='single'
					collapsible
					className='w-full md:w-1/3 border-b border-white md:hidden text-center'
				>
					<AccordionItem value='products'>
						<AccordionTrigger className='text-white uppercase font-bold py-4'>
							{ContentFooter.links.productsTitle}
						</AccordionTrigger>
						<AccordionContent className='text-white w-full'>
							<LinkFooterProducts products={products} />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='info'>
						<AccordionTrigger className='text-white uppercase font-bold py-4l'>
							{ContentFooter.links.infoTitle}
						</AccordionTrigger>
						<AccordionContent className='text-white w-full'>
							<FooterInformation />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='company'>
						<AccordionTrigger className='text-white uppercase font-bold py-4'>
							{ContentFooter.links.companyTitle}
						</AccordionTrigger>
						<AccordionContent className='text-white w-full'>
							<CompanyFooterInfo />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<p className='py-6 text-white text-sm text-center border-t border-t-white'>
				{ContentFooter.footer.copyright}
			</p>
		</footer>
	)
}

export default Footer
