'use server'
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

interface Props {
	email: string
}
export const mailBannerHtml = async ({ email }: Props) => {
	try {
		const item = await resend.emails.send({
			from: 'info@daypatron.com.ua',
			to: [email],
			subject: 'Дякуємо! Ви успішно підписались на розсилку DayPatron',
			html: `
<table style="width: 100%; max-width: 600px; margin: 0 auto;">
  <!-- Header -->
  <tr>
    <td style="background-color: white; color: #B3B3B3; text-align: center;">
     <img src="https://day-patron-next.vercel.app/images/DayLogo_black.png" alt="DayPatron Logo" style="width: 250px; height: auto; margin: 16px 0;" />
    </td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 4px 8px; background-color: white; color: #B3B3B3;">
      <a href="https://day-patron-next.vercel.app/" style="font-size: 18px; text-decoration: none; margin: 0 8px;">Головна</a>
      <a href="https://day-patron-next.vercel.app/products" style="font-size: 18px; text-decoration: none; margin: 0 8px;">Продукти</a>
      <a href="https://day-patron-next.vercel.app/about" style="font-size: 18px; text-decoration: none; margin: 0 8px;">Про нас</a>
      <a href="https://day-patron-next.vercel.app/partners" style="font-size: 18px; text-decoration: none; margin: 0 8px;">Партнери</a>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="padding: 16px;">
      <img src="https://day-patron-next.vercel.app/images/2024.png" alt="Promo" style="width: 100%; height: auto;" />
    </td>
  </tr>
  <tr>
    <td style="text-align: center; padding: 16px; background-color: white; color: #B3B3B3;">
      <h1 style="color: #B3B3B3; font-size: 24px; margin: 16px 0;">Використовуйте промокод "СТАРТ-20" під час оформлення замовлення та отримайте знижку 20%.</h1>
      <p style="color: #B3B3B3; font-size: 14px;">Цей промокод можна використати лише один раз! Вводьте його під час оформлення замовлення точно так, як зазначено.</p>
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="padding: 16px; background-color: white; color: black; text-align: center;">
      <p>З повагою,<br />Команда підтримки DayPatron</p>
      <img src="https://day-patron-next.vercel.app/images/DayLogo_black.png" alt="DayPatron Logo" style="width: 100px; height: auto; margin: 4px 0;" />
      <p>Телефон: +38 (099) 730-21-26</p>
      <p>Ел. пошта: daypatronteam@gmail.com</p>
      <p>Сайт: <a href="http://www.daypatron.com" style="color: #1E90FF; text-decoration: none;">www.daypatron.com</a></p>
      <hr style="border: 0; border-top: 1px solid #555; margin: 16px 0;" />
      <p>© 2023 DayPatron Inc. Усі права захищені</p>
    </td>
  </tr>
</table>
			`,
		})
		return item
	} catch (error) {
		console.log(error)
	}
}
