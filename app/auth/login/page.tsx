import { LoginForm } from '@/components/LoginForm/login-form'

const LoginPage = () => {
	return (
		<div className='sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 flex justify-center items-center min-h-screen mx-2'>
			<LoginForm />
		</div>
	)
}

export default LoginPage
