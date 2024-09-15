import { LoginForm } from '@/components/LoginForm/login-form'

const LoginPage = () => {
	return (
		<div className='sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0 lg:-translate-y-1/4 flex justify-center items-center max-h-screen mx-4'>
			<LoginForm />
		</div>
	)
}

export default LoginPage
