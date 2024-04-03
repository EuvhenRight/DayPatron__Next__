'use client'
import SignOut from '@/components/SignOut/sign-out'
import { LogOutProvider } from '@/lib/providers/LogOutProvider'
import React, { memo, useCallback, useState } from 'react'
import Drawer from '../components/Drawer'
import Header from '../components/Header'
import CartProvider from '../lib/providers/CartProvider'
import { SpinnerProvider } from '../lib/providers/SpinnerProvider'

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
			<LogOutProvider>
				<SpinnerProvider>
					<CartProvider>
						<SignOut />
						<Drawer toggleDrawer={toggleDrawer} isOpenDrawer={isOpenDrawer} />
						<Header toggleDrawer={toggleDrawer} />
						<main>{children}</main>
					</CartProvider>
				</SpinnerProvider>
			</LogOutProvider>
		</div>
	)
})

export default ClientLayout
