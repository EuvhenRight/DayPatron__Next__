import data from '@/lib/db/content.json'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export const CompanyFooterInfo = () => {
	const { ContentFooter } = data
	const { status } = useSession()
	const isAuthenticated = status === 'authenticated'

	const links = [
		{ label: ContentFooter.links.aboutUs, href: '/about', alwaysVisible: true },
		{
			label: ContentFooter.links.whereToBuy,
			href: '/where-to-buy',
			alwaysVisible: true,
		},
		{
			label: ContentFooter.links.contacts,
			href: '/contacts',
			alwaysVisible: true,
		},
		{
			label: ContentFooter.links.account,
			href: '/auth/register',
			authRequired: false,
		},
		{
			label: ContentFooter.links.profile,
			href: '/dashboard/profile',
			authRequired: true,
		},
		{
			label: ContentFooter.links.infoTitle,
			href: '/dashboard/information',
			authRequired: true,
		},
		{
			label: ContentFooter.links.orders,
			href: '/dashboard/order',
			authRequired: true,
		},
	]

	// Filter the links based on authentication status
	const filteredLinks = links.filter(link => {
		if (link.alwaysVisible) {
			return true // Always show links marked as alwaysVisible
		}
		if (isAuthenticated && !link.authRequired) {
			return false // Hide "Маєте аккаунт?" if authenticated
		}
		if (!isAuthenticated && link.authRequired) {
			return false // Hide authenticated links if not authenticated
		}
		return true
	})

	return (
		<div className='mb-4 flex flex-col'>
			<h3 className='text-white uppercase font-bold py-4 hidden md:block'>
				{ContentFooter.links.companyTitle}
			</h3>
			<ul className='flex flex-col gap-4'>
				{filteredLinks.map((link, index) => (
					<li key={index} className='flex flex-col gap-2'>
						<Link href={link.href} className='text-gray-300 hover:text-white'>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
