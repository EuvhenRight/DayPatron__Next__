import { getCurrentUser } from '@/actions/user'
import { ContactsComponent } from '@/components/Contacts/contacts-component'
import { GoogleMap } from '@/components/Contacts/googleMap'
import { FeedBackForm } from '@/components/FeedbackForm/feedback-form'
import data from '@/lib/db/content.json'
import {
	Earth,
	Factory,
	Forklift,
	Mail,
	MapPin,
	Phone,
	Send,
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'DayPatron__Контакти',
	description: 'Приєднуйтесь до нас',
}

export default async function ContactsPage() {
	const [currentUser] = await Promise.all([getCurrentUser()])
	const { ContentContactsPage } = data
	const contactData = [
		{
			icon: <Factory size={28} />,
			text: ContentContactsPage.page.manufacturer,
		},
		{
			icon: <MapPin size={28} />,
			text: ContentContactsPage.page.manufacturer_address,
		},
		{ icon: <Send size={28} />, text: ContentContactsPage.page.email },
		{
			icon: <Earth size={28} />,
			text: ContentContactsPage.page.manufacturer_link,
			link: 'https://ekokemika.ua/',
		},
		{
			icon: <Forklift size={28} />,
			text: ContentContactsPage.page.distributor,
		},
		{ icon: <Phone size={28} />, text: ContentContactsPage.page.phone },
		{
			icon: <Mail size={28} />,
			text: ContentContactsPage.page.email_daypatron,
		},
		{
			icon: <Earth size={28} />,
			text: ContentContactsPage.page.web_daypatron,
			link: 'https://daypatron.com.ua',
		},
	]
	return (
		<>
			<section className='container lg:pt-10 relative flex flex-row w-full pt-2 mb-4'>
				<div className='w-1/2 text-start'>
					<h1 className='text-2xl font-bold'>
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
				<div className='w-1/2'>
					<h1 className='text-2xl font-bold text-center pb-10'>
						{ContentContactsPage.form.title}
					</h1>
					<FeedBackForm currentUser={currentUser} />
				</div>
			</section>
			<section>
				<GoogleMap />
			</section>
		</>
	)
}
