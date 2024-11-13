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
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		service: 'gmail',
		auth: {
			user: process.env.KEY_USER_MAIL,
			pass: process.env.KEY_PASSWORD_APP,
		},
	})

	await new Promise((resolve, reject) => {
		// verify connection configuration
		transporter.verify(function (error, success) {
			if (error) {
				console.log(error)
				reject(error)
			} else {
				console.log('Server is ready to take our messages')
				resolve(success)
			}
		})
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

	await new Promise((resolve, reject) => {
		// send mail
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.error(err)
				reject(err)
			} else {
				console.log(info)
				resolve(info)
			}
		})
	})

	console.log('Email sent successfully')
}
