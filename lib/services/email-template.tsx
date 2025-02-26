'use server'
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

interface Props {
	email: string
	generatedPassword: string
}

export async function sendLoginPassword({ email, generatedPassword }: Props) {
	try {
		const data = await resend.emails.send({
			from: 'info@daypatron.com.ua',
			to: [email],
			subject: 'DayPatron 6-значний пароль',
			html: `<p style="font-size: 14px; color: #666;">Ваш 6-значний пароль: <strong>${generatedPassword}</strong></p>
			<p style="font-size: 14px; color: #666;">Цей код може бути використаний лише один раз. Термін дії коду: 15 хвилин.</p>
			<p>З повагою,<br>Команда підтримки DayPatron<br>
			<img src="${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_IMAGE_URL}/DayLogo_black.png alt="DayPatron_Logo" style="display: block; width: 150px; height: 50px;">
			</p> 
					<p style="font-size: 12px; color: #999;">телефон:  +38 (099) 730-21-26 <br>ел.пошта: daypatronteam@gmail.com <br>cайт: http://www.daypatron.com</p>
		<div>
			<p style="font-size: 12px; text-align: center; color: #999;">© 2023 DayPatron Inc. Усі права захищені</p>
		</div>`,
		})
	} catch (error) {
		console.error(error)
	}
}
