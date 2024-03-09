'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AiFillHome } from 'react-icons/ai'

interface BreadcrumbsProps {
	children?: string
}
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ children }) => {
	const pathname = usePathname()

	const breadcrumbLinks = [
		{
			path: '/',
			text: '',
			icon: <AiFillHome style={{ width: '20px', height: '20px' }} />,
		},
		{ path: '/products', text: 'Products' },
	]

	// FILTER THE BREADCRUMBS LINKS
	const filteredBreadcrumbs = breadcrumbLinks.filter(
		breadcrumb => breadcrumb.path !== pathname
	)

	return (
		<div className='text-sm breadcrumbs py-4'>
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
