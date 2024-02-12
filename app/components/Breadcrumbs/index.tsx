'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AiFillHome } from 'react-icons/ai'

interface BreadcrumbsProps {
	children?: string
}
const Breadcrumbs = ({ children }: BreadcrumbsProps) => {
	const pathname = usePathname()

	// Define the breadcrumb links based on the current page
	const breadcrumbLinks = [
		{
			path: '/',
			text: '',
			icon: <AiFillHome style={{ width: '20px', height: '20px' }} />,
		},
		{ path: '/products', text: 'Products' },
	]

	// Filter out the current page from the breadcrumb links
	const filteredBreadcrumbs = breadcrumbLinks.filter(
		breadcrumb => breadcrumb.path !== pathname
	)

	return (
		<div className='text-sm breadcrumbs text-textBody py-4'>
			<ul>
				{filteredBreadcrumbs.map((breadcrumb, index) => (
					<li key={index}>
						<Link href={breadcrumb.path} className='flex items-center'>
							{breadcrumb.icon} {breadcrumb.text}
						</Link>
					</li>
				))}
				<li>{children}</li>
			</ul>
		</div>
	)
}

export default Breadcrumbs
