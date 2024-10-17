'use server'
import { Resend } from 'resend'
const resend = new Resend('re_ZQV2MQZT_5wCXm2t21PPBsvC1MnjQvNkM')

export async function sentTest() {
	try {
		const data = await resend.emails.send({
			from: 'info@daypatron.com.ua',
			to: ['ugnivenko.ea@gmail.com'],
			subject: 'Hello World',
			html: '<strong>It works!</strong>',
		})

		console.log(data)
	} catch (error) {
		console.error(error)
	}
}
