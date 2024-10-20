// app/api/feedback/route.ts
import { sendEmail } from '@/lib/services/mail-password'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const requestData = await request.json()

		await sendEmail({
			to: requestData.email,
			subject: 'Повідомлення до підтримки клієнтів DayPatron',
			text: `Шановний(а) ${requestData.name},
		
		Дякуємо за ваше повідомлення: "${requestData.message}". Ми високо цінуємо ваш інтерес до наших послуг. Наша команда підтримки уважно розгляне ваш запит і зв'яжеться з вами найближчим часом.
		
		Контактні дані клієнта:
		Електронна пошта: ${requestData.email}
		Телефон: ${requestData.phone}`,

			html: `<p style="font-size: 14px; color: #666;">Шановний(а) ${requestData.name}</p>
			<p style="font-size: 14px; color: #666;">Дякуємо за ваше повідомлення: <strong>"${requestData.message}"</strong></p>
			<p style="font-size: 14px; color: #666;">Ми високо цінуємо ваш інтерес до наших послуг. Наша команда підтримки уважно розгляне ваш запит і зв'яжеться з вами найближчим часом.</p>

			<p style="font-size: 14px; color: #666;">Контактні дані клієнта: <br>
			Ім'я: ${requestData.name} <br>
			Електронна пошта: ${requestData.email} <br>
			Телефон: ${requestData.phone}</p>

			<p>З повагою,<br>Команда підтримки DayPatron<br>
			<img src="process.env.NEXT_PUBLIC_IMAGE_URL/DayLogo_black.svg" alt="DayPatron Logo" style="display: block; width: 150px; height: 50px;">
			</p> 
					<p style="font-size: 12px; color: #999;">телефон:  +38 (099) 730-21-26 <br>ел.пошта: daypatronteam@gmail.com <br>cайт: http://www.daypatron.com</p>
			<p style="font-size: 12px; color: #999; text-align: center">© 2023 DayPatron Inc. Усі права захищені</p>,
		`,
		})

		return NextResponse.json({ success: true }, { status: 200 })
	} catch (error) {
		console.error('Error processing login request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
