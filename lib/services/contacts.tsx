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
const { ContentContactsPage } = data

export const contactData = [
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
