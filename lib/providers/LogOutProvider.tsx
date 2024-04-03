import { LogOutContext } from '@/lib/hooks/useLogout'
import { useState } from 'react'

interface LogOutContextType {
	children: React.ReactNode
}
export const LogOutProvider: React.FC<LogOutContextType> = ({ children }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleOpen = () => {
		setIsModalOpen(true)
	}

	const handleClose = () => {
		setIsModalOpen(false)
	}

	return (
		<LogOutContext.Provider value={{ isModalOpen, handleOpen, handleClose }}>
			{children}
		</LogOutContext.Provider>
	)
}
