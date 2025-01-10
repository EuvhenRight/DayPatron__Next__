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
			html: `<div style="display: flex; flex-direction: column; width: 600px; height: auto; background-color: black; margin: 0 auto;">
  <!-- Header -->
  <div>
    <div style="display: flex; justify-content: center; width: 100%;">
      <img  src="https://day-patron-next.vercel.app/images/DayLogo.svg"  alt='logo' style="width: 50%; padding: 8px;" />
    </div>
    <nav style="color: white; font-size: 18px; display: flex; justify-content: center;">
      <a style="padding: 16px; color: white; text-decoration: none;" href='https://day-patron-next.vercel.app/'>
        Головна
      </a>
      <a style="padding: 16px; color: white; text-decoration: none;" href='https://day-patron-next.vercel.app/products'>
        Продукти
      </a>
      <a style="padding: 16px; color: white; text-decoration: none;" href='https://day-patron-next.vercel.app/about'>
        Про нас
      </a>
      <a style="padding: 16px; color: white; text-decoration: none;" href='https://day-patron-next.vercel.app/partners'>
        Партнери
      </a>
    </nav>
  </div>

  <!-- Body -->
  <div style="color: white; font-size: 18px; padding: 16px; relative;">
    <img  src="https://day-patron-next.vercel.app/images/2024.png" alt='promo' style="padding: 8px; width: 100%;" />
    <h1 style="padding: 8px; color: white; font-size: 24px; text-align: center;">
      Використовуйте промокод "СТАРТ-20" під час оформлення замовлення та отримайте знижку 20%.
    </h1>
    <p style="padding: 8px; color: #B3B3B3;">
      Цей промокод можна використати лише один раз! Вводьте його під час оформлення замовлення точно так, як зазначено.
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #333; color: #B3B3B3; font-size: 14px; padding: 16px; margin-top: 16px;">
    <div style="display: flex; flex-direction: column; align-items: start;">
      <p style="text-align: center; margin-bottom: 16px;">
        З повагою,<br />
        Команда підтримки DayPatron
      </p>
      <img 
        src="https://day-patron-next.vercel.app/images/opengraph-image.png" 
        alt='DayPatron Logo' 
        style="width: 150px; height: 50px; margin-bottom: 16px;"
      />
      <div style="text-align: center; margin-bottom: 16px;">
        <p>Телефон: +38 (099) 730-21-26</p>
        <p>Ел. пошта: daypatronteam@gmail.com</p>
        <p>Сайт: <a href='http://www.daypatron.com' style="color: #1E90FF; text-decoration: none;">www.daypatron.com</a></p>
      </div>
    </div>
    <div style="text-align: center; border-top: 1px solid #555; padding-top: 16px;">
      <p>© 2023 DayPatron Inc. Усі права захищені</p>
    </div>
  </div>
</div>`,
		})
		return item
	} catch (error) {
		console.log(error)
	}
}
