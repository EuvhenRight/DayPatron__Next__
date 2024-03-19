'use client'
import { useCart } from '@/app/lib/hooks/useCart'
import { memo, useEffect } from 'react'
import CartItem from '../Cart-item'
import PriceTag from '../PriceTag'

interface Props {
	isOpenDrawer: boolean
	toggleDrawer: () => void
}
const Drawer: React.FC<Props> = memo(({ toggleDrawer, isOpenDrawer }) => {
	const { cartItems, cartTotalAmount, cartTotalSumDiscount } = useCart()

	//UPDATE BODY OVERFLOW
	useEffect(() => {
		if (isOpenDrawer) {
			document.body.classList.add(
				'overflow-hidden',
				'bg-modalBg',
				'bg-opacity-60'
			)
		} else {
			document.body.classList.remove(
				'overflow-hidden',
				'bg-modalBg',
				'bg-opacity-60'
			)
		}
	}, [isOpenDrawer])

	return (
		<div
			className={`fixed top-0 left-0 right-0 bottom-0 w-full h-full z-40 ${
				isOpenDrawer ? 'translate-x-0' : 'translate-x-full'
			} ease-in-out duration-300`}
		>
			<div
				className={`bg-drawers absolute top-0 right-0 h-full w-full sm:w-96 z-50 p-4 flex flex-col overflow-auto`}
			>
				{/* FIRST PART CART */}
				<div>
					<div className='flex gap-5 justify-between items-center border-b-2 border-white pb-4 mb-1'>
						<h2 className='text-3xl font-bold flex items-center gap-5 text-white'>
							CART
						</h2>
					</div>
					{/* IF CART IS EMPTY */}
					{!cartItems || cartItems.length === 0 ? (
						<h2 className='text-white text-lg md:text-xl py-2'>
							Your cart is empty
						</h2>
					) : (
						<>
							<div className='border-b-2 border-white pb-4 mb-1 overflow-auto max-h-[400px] sm:max-h-[500px]'>
								{cartItems.map((item, index) => (
									<CartItem
										toggleDrawer={toggleDrawer}
										key={index}
										item={item}
									/>
								))}
							</div>
							{/* SECOND PART CHECKOUT */}
							<div className='relative'>
								{/* SUBTOTAL AND DISCOUNT */}
								<div className='flex flex-col text-white py-4 mb-4'>
									<div className='flex justify-between'>
										<h2>SUBTOTAL</h2>
										<h2>{<PriceTag price={cartTotalAmount} />}</h2>
									</div>
									<div className='flex justify-between'>
										<h2>DISCOUNT</h2>
										<h2 className='text-green-500'>
											-{<PriceTag price={cartTotalSumDiscount} />}
										</h2>
									</div>
								</div>
								{/* CHECKOUT */}
								<button className='w-full bg-btnPrimary text-white text-xl py-2 transition ease-in-out delay-350 animate-pulse'>
									Checkout
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
})
export default Drawer
