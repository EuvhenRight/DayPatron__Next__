import Link from 'next/link'

export const FooterInformation = () => {
	return (
		<div>
			<h3 className='text-white uppercase font-bold py-4'>Інформація</h3>
			<ul className='text-gray-300'>
				<li className='py-2 hover:text-white'>
					<Link href='/privacy'>Політика конфіденційності</Link>
				</li>
				<li className='py-2  hover:text-white'>
					<Link href='/delivery'>Умови доставки та оплати</Link>
				</li>
				<li className='py-2  hover:text-white'>
					<Link href='/warranty'>Гарантія та повернення</Link>
				</li>
			</ul>
		</div>
	)
}
