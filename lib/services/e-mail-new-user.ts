import { z } from 'zod'
import { ValidationSchema } from '../db/validation'

interface Props {
	message: z.infer<typeof ValidationSchema.reviews>
}
export const createReviewEmailHtml = ({ message }: Props) => {
	return `
		<table style="font-size: 14px; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
			<tr>
				<td colspan="2" style="text-align: center; padding: 10px 0;">
					<h1>Дякуємо ${message.fullName} за Ваш відгук!</h1>
					<p>Ми вдячні за те, що Ви поділилися своїми думками про наш продукт на сайті DayPatron.</p>
					<p>Ваш відгук: "${message.message}"</p>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="padding: 10px 0;">
					<p style="font-size: 14px;">Ви ще не зареєстровані на нашому сайті, але Ви можете увійти на наш сайт за посиланням <a href="http://localhost:3000/auth/register" style="color: #007bff;">Вхід</a>, щоб зареєструватися та отримати можливість видалити або редагувати свій відгук.</p>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="padding: 10px 0;">
					<p style="font-size: 14px;">Якщо у Вас виникнуть будь-які запитання або потрібна допомога, наша команда готова відповісти на них.</p>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="padding: 10px 0; text-align: center;">
					<p style="font-size: 14px;">З повагою, команда DayPatron</p>
				</td>
			</tr>
		</table>
		<div>
			<p style="font-size: 12px; text-align: center; color: #999;">© 2023 DayPatron Inc. Усі права захищені</p>
		</div>
	`
}
