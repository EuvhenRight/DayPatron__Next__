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
		setIsOpenDrawer(!isOpenDrawer)
	}, [isOpenDrawer])

	return (
		<div>
			<CartProvider>
				{isOpenDrawer && (
					<Drawer toggleDrawer={toggleDrawer} isOpenDrawer={isOpenDrawer} />
				)}
				<Header toggleDrawer={toggleDrawer} />
				<main>{children}</main>
			</CartProvider>
		</div>
	)
})

export default ClientLayout
