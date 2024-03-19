'use client'
import { createContext, useContext } from 'react'

interface SpinnerContextType {
	isLoading: boolean
	startLoading: () => void
	stopLoading: () => void
}

// Create the Spinner context with an initial default value
export const SpinnerContext = createContext<SpinnerContextType>({
	isLoading: false,
	startLoading: () => {},
	stopLoading: () => {},
})

// Create a custom hook to consume the Spinner context
export const useSpinner = () => useContext(SpinnerContext)
