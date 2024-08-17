import data from '@/lib/db/content.json'
import Link from 'next/link'
export const FooterInformation = () => {
	const { ContentFooter } = data

	return (
		<div className='mb-4 flex flex-col'>
			<h3 className='text-white uppercase font-bold py-4 hidden md:block'>
				{ContentFooter.links.infoTitle}
			</h3>
			<ul className='text-gray-300'>
				<li className='py-2 hover:text-white'>
					<Link href='/privacy'>{ContentFooter.links.privacy}</Link>
				</li>
				<li className='py-2  hover:text-white'>
					<Link href='/delivery'>{ContentFooter.links.delivery}</Link>
				</li>
				<li className='py-2  hover:text-white'>
					<Link href='/warranty'>{ContentFooter.links.warranty}</Link>
				</li>
				<li className='py-2  hover:text-white'>
					<Link href='/guide'>{ContentFooter.links.guide}</Link>
				</li>
			</ul>
		</div>
	)
}
