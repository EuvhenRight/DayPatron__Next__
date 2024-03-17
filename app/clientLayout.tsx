'use client'
import React, { memo, useCallback, useState } from 'react'
import Drawer from './components/drawer'
import Header from './components/header'
import CartProvider from './lib/providers/CartProvider'

interface ClientLayoutProps {
	children: React.ReactNode
}

const ClientLayout: React.FC<ClientLayoutProps> = memo(({ children }) => {
	const [isOpenDrawer, setIsOpenDrawer] = useState(false)

	const toggleDrawer = useCallback(() => {
		setIsOpenDrawer(prev => !prev)
	}, [isOpenDrawer])

	return (
		<div className='relative'>
			{isOpenDrawer && (
				<button
					onClick={() => toggleDrawer()}
					className='border border-white m-4 p-1 marker:hover:translate-x-0 opacity-60 text-white hover:opacity-100 transition text-sm absolute top-0 right-0 z-50 '
				>
					Close
				</button>
			)}
			<CartProvider>
				<Drawer toggleDrawer={toggleDrawer} isOpenDrawer={isOpenDrawer} />
				<Header toggleDrawer={toggleDrawer} />
				<main>{children}</main>
			</CartProvider>
		</div>
	)
})

export default ClientLayout