'use client'
import React, { useState } from 'react'
import Drawer from './components/drawer'
import Header from './components/header'
import CartProvider from './lib/providers/CartProvider'

function ClientLayout({ children }: { children: React.ReactNode }) {
	const [isOpenDrawer, setIsOpenDrawer] = useState(false)

	const toggleDrawer = () => {
		setIsOpenDrawer(!isOpenDrawer)
	}

	return (
		<div>
			<CartProvider>
				{isOpenDrawer && <Drawer toggleDrawer={toggleDrawer} />}
				<Header toggleDrawer={toggleDrawer} />
				<main>{children}</main>
			</CartProvider>
		</div>
	)
}

export default ClientLayout
