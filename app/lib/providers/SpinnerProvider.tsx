import { SpinnerContext } from '@/app/lib/hooks/useSpinner'
import { useState } from 'react'

interface SpinnerContextType {
	children: React.ReactNode
}
export const SpinnerProvider: React.FC<SpinnerContextType> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false)

	const startLoading = () => setIsLoading(true)
	const stopLoading = () => setIsLoading(false)

	return (
		<SpinnerContext.Provider value={{ isLoading, startLoading, stopLoading }}>
			{children}
		</SpinnerContext.Provider>
	)
}
