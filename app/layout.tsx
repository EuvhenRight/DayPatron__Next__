import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import ClientLayout from './clientLayout'
import './globals.css'
const mulish = Mulish({
	weight: ['200', '300', '400', '500', '600', '700'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'DayPatron',
	description: 'Догляд, що перевершує очікування',
}

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' data-theme='dark'>
			<body className={mulish.className}>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	)
}

export default RootLayout
