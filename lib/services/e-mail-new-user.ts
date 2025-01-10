'use server'
import { Resend } from 'resend'
import { z } from 'zod'
import { ValidationSchema } from '../db/validation'
const resend = new Resend(process.env.RESEND_API_KEY)

interface Props {
	message: z.infer<typeof ValidationSchema.reviews>
}
export const createReviewEmailHtml = async ({ message }: Props) => {
	try {
		const item = await resend.emails.send({
			from: 'info@daypatron.com.ua',
			to: [message.email, 'daypatronteam@gmail.com'],
			subject: `Дякуємо ${message.fullName}, за відгук на сайті DayPatron`,
			html: `<table style="font-size: 14px; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
		<tr>
			<td colspan="2" style="text-align: start; padding: 10px 0;">
				<p style="font-size: 14px; color: #666;">Дякуємо ${message.fullName} за Ваш відгук!</p>
				<p>Ми вдячні за те, що Ви поділилися своїми думками про наш продукт на сайті DayPatron.</p>
				<p>Ваш відгук: "${message.message}"</p>
			</td>
		</tr>
		<tr>
			<td colspan="2" style="padding: 10px 0;">
				<p style="font-size: 14px;">Ви ще не зареєстровані на нашому сайті, але Ви можете увійти на наш сайт за посиланням <a href="process.env.NEXT_PUBLIC_APP_URL/auth/register" style="color: #007bff;">Вхід</a>, щоб зареєструватися та отримати можливість видалити або редагувати свій відгук.</p>
			</td>
		</tr>
		<tr>
			<td colspan="2" style="padding: 10px 0;">
				<p style="font-size: 14px;">Якщо у Вас виникнуть будь-які запитання або потрібна допомога, наша команда готова відповісти на них.</p>
			</td>
		</tr>
		<tr>
			<td colspan="2" style="padding: 10px 0; text-align: start;">
						<p>З повагою,<br>Команда підтримки DayPatron<br>
		<img src=${process.env.NEXT_PUBLIC_IMAGE_URL}/opengraph-image.png alt="DayPatron Logo" style="display: block; width: 150px; height: 50px;">
		</p> 
				<p style="font-size: 12px; color: #999;">телефон:  +38 (099) 730-21-26 <br>ел.пошта: daypatronteam@gmail.com <br>cайт: http://www.daypatron.com</p>
			</td>
		</tr>
	</table>
	<div>
		<p style="font-size: 12px; text-align: center; color: #999;">© 2023 DayPatron Inc. Усі права захищені</p>
	</div>
`,
		})

		return item
	} catch (error) {
		console.log(error)
	}
}
