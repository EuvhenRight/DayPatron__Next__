import nodeMailer from 'nodemailer'
export const generateRandomPassword = () => {
	// You can customize this function to generate a random password as per your requirements.
	// For example, you can use a library like `crypto` to generate a secure random password.
	// Here, we're generating an 6-character password with alphanumeric characters.
	const length = 6
	const charset = '0123456789'
	let randomPassword = ''

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length)
		randomPassword += charset.charAt(randomIndex)
	}

	return randomPassword
}

type EmailType = {
	to: string | string[]
	subject: string
	text: string
	html?: string
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export const sendEmail = ({
	to,
	subject,
	text,
	html,
}: EmailType): Promise<void> => {
	// Create a transporter object using your email service provider's SMTP settings
	const transporter = nodeMailer.createTransport({
		// pool: true,
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		service: 'gmail',
		auth: {
			user: process.env.KEY_USER_MAIL,
			pass: process.env.KEY_PASSWORD_APP,
		},
		tls: { rejectUnauthorized: false },
	})

	// Ensure the `to` field is a string, even if it's an array
	const toAddresses = Array.isArray(to) ? to.join(', ') : to

	// Email data
	const mailOptions = {
		from: process.env.KEY_USER_MAIL,
		to: toAddresses,
		subject,
		text,
		html,
	}

	// Return a promise
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error('Error sending email:', error)
				reject(error)
			} else {
				console.log('Email sent: ' + info.response)
				resolve()
			}
		})
	})
}
