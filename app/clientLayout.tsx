'use client'
import React, { useState } from 'react'
import Drawer from './components/drawer'
import Header from './components/header'

function ClientLayout({ children }: { children: React.ReactNode }) {
	const [isOpenDrawer, setIsOpenDrawer] = useState(false)

	const toggleDrawer = () => {
		setIsOpenDrawer(!isOpenDrawer)
	}

	return (
		<>
			{isOpenDrawer && <Drawer toggleDrawer={toggleDrawer} />}
			<Header toggleDrawer={toggleDrawer} />
			<main>{children}</main>
		</>
	)
}

export default ClientLayout
