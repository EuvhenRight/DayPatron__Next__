import { ContactsComponent } from '@/components/Contacts/contacts-component'
import { GoogleMapComponent } from '@/components/Contacts/googleMap'
import { FeedBackForm } from '@/components/FeedbackForm/feedback-form'
import data from '@/lib/db/content.json'
import { contactData } from '@/lib/services/contacts'
import { getCurrentUser } from '@/lib/services/user'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Metadata } from 'next'

//METADATA GENERATOR
export const metadata: Metadata = {
	title: 'Контакти',
	description: 'Звяжіться з нами, щоб дізнатися більше про нас.',
	openGraph: {
		title: 'Контакти',
		locale: 'uk-UA',
		description: 'Звяжіться з нами, щоб дізнатися більше про нас.',
		url: `https://daypatron.com/contacts`,
		type: 'website',
		images: [
			{
				url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/DayLogo_black.svg`,
				width: 800,
				height: 600,
				alt: 'Ukraine',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Контакти',
		description: 'Звяжіться з нами, щоб дізнатися більше про нас.',
		site: 'https://daypatron.com',
		creator: 'daypatronteam',
		images: `${process.env.NEXT_PUBLIC_IMAGE_URL}/DayLogo_black.svg`,
	},
}

// Ensure dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
	const currentUser = await getCurrentUser()
	const { ContentContactsPage } = data

	return (
		<div>
			<section className='container lg:pt-10 relative flex flex-col md:flex-row w-full pt-2 mb-4'>
				<div className='w-full md:w-1/2 text-start'>
					<h1 className={cn(rubikGlitch.className, 'text-2xl font-bold')}>
						{ContentContactsPage.page.title}
					</h1>
					<ul className='my-2 pt-4 *:my-4'>
						{contactData.map(({ icon, text, link }, index) => (
							<li key={index} className='flex items-center justify-start gap-2'>
								<ContactsComponent icon={icon} text={text} link={link} />
							</li>
						))}
					</ul>
				</div>
				<div className='w-full md:w-1/2 flex flex-col justify-start'>
					<FeedBackForm currentUser={currentUser} />
				</div>
			</section>
			<section>
				<GoogleMapComponent />
			</section>
		</div>
	)
}
