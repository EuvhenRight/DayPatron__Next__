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

export const sendEmail = async ({
	to,
	subject,
	text,
	html,
}: EmailType): Promise<void> => {
	// Create a transporter object using your email service provider's SMTP settings
	const transporter = nodeMailer.createTransport({
		// service: "Yahoo", // e.g., 'Gmail', 'Yahoo', 'Outlook', etc.
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.KEY_USER_MAIL,
			pass: process.env.KEY_PASSWORD_APP,
		},
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

	try {
		// Send the email
		const info = await transporter.sendMail(mailOptions)
	} catch (error) {
		console.error('Error sending email:', error)
		throw error
	}
}
