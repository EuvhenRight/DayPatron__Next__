'use server'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
	try {
		const requestData = await request.json()

		await resend.emails.send({
			from: 'info@daypatron.com.ua',
			to: [requestData.email, 'daypatronteam@gmail.com'],
			subject: 'Повідомлення до підтримки клієнтів DayPatron',
			html: `<p style="font-size: 14px; color: #666;">Шановний(а) ${requestData.name}</p>
			<p style="font-size: 14px; color: #666;">Дякуємо за ваше повідомлення: <strong>"${requestData.message}"</strong></p>
			<p style="font-size: 14px; color: #666;">Ми високо цінуємо ваш інтерес до наших послуг. Наша команда підтримки уважно розгляне ваш запит і зв'яжеться з вами найближчим часом.</p>

			<p style="font-size: 14px; color: #666;">Контактні дані клієнта: <br>
			Ім'я: ${requestData.name} <br>
			Електронна пошта: ${requestData.email} <br>
			Телефон: ${requestData.phone}</p>

			<p>З повагою,<br>Команда підтримки DayPatron<br>
			<img src=${process.env.NEXT_PUBLIC_IMAGE_URL}/opengraph-image.png alt="DayPatron Logo" style="display: block; width: 150px; height: 50px;">
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
