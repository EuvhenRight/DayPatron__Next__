'use client'
import { createContext, useContext } from 'react'

interface LogOutContextType {
	isModalOpen: boolean
	handleOpen: () => void
	handleClose: () => void
}

// Create the Spinner context with an initial default value
export const LogOutContext = createContext<LogOutContextType>({
	isModalOpen: false,
	handleOpen: () => {},
	handleClose: () => {},
})

// Create a custom hook to consume the Spinner context
export const useLogOut = () => useContext(LogOutContext)
