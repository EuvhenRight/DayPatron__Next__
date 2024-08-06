// app/api/feedback/route.ts
import { sendEmail } from '@/lib/services/mail-password'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const requestData = await request.json()

		await sendEmail({
			to: requestData.email, // TODO: add array of emails
			subject: 'Повідомлення до підтримки клієнтів DayPatron',
			text: `Шановний(а) ${requestData.name},
		
		Дякуємо за ваше повідомлення: "${requestData.message}". Ми високо цінуємо ваш інтерес до наших послуг. Наша команда підтримки уважно розгляне ваш запит і зв'яжеться з вами найближчим часом.
		
		З повагою,
		Команда підтримки DayPatron
		
		Контактні дані:
		Електронна пошта: ${requestData.email}
		Телефон: ${requestData.phone}
		
		© 2023 DayPatron Inc. Усі права захищені.`,
			html: `
				<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
					<p>Шановний(а) <strong>${requestData.name}</strong>,</p>
					<p>Дякуємо за ваше повідомлення:</p>
					<blockquote style="font-size: 14px; font-style: italic; color: #555;">"${requestData.message}"</blockquote>
					<p>Ми високо цінуємо ваш інтерес до наших послуг. Наша команда підтримки уважно розгляне ваш запит і зв'яжеться з вами найближчим часом.</p>
					<p>З повагою,<br>Команда підтримки DayPatron<br>
					<img src="http://localhost:3000/images/DayLogo_black.svg" alt="DayPatron Logo" style="display: block; width: 150px; height: 50px;">
					</p> 
					<hr style="border: none; border-top: 1px solid #eee;">
					<p style="font-size: 14px; color: #666;">Контактні дані користувача <br>Їм'я: ${requestData.name}<br>
					Електронна пошта: ${requestData.email}<br>
					Телефон: ${requestData.phone}</p>
					<p style="font-size: 12px; color: #999; text-align: center;">© 2023 DayPatron Inc. Усі права захищені</p>
				</div>
			`,
		})
		//TODO: add message model and show it inside information page
		return NextResponse.json({ success: true }, { status: 200 })
	} catch (error) {
		console.error('Error processing login request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
