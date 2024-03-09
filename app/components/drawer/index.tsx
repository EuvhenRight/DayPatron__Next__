'use client'
import { useCart } from '@/app/lib/hooks/useCart'
import { IoMdClose } from 'react-icons/io'
import CartItem from '../Cart-item'
import PriceTag from '../PriceTag'

interface Props {
	isOpenDrawer: boolean
	toggleDrawer: () => void
}
const Drawer: React.FC<Props> = ({ toggleDrawer, isOpenDrawer }) => {
	const { cartItems, handleClearCart, cartTotalAmount, cartTotalSumDiscount } =
		useCart()

	return (
		<div
			className={`fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 z-10 ${
				!isOpenDrawer && 'animate-drawer-close'
			}`}
		>
			<div
				className={`bg-[--colorDrawers] fixed top-0 right-0 h-full w-96 z-20 p-4 flex flex-col ${
					isOpenDrawer && 'animate-drawer-open'
				}`}
			>
				{/* FIRST PART CART */}
				<div>
					<div className='flex gap-5 justify-between items-center border-b-2 border-white pb-4 mb-1'>
						<h2 className='text-3xl font-bold flex items-center gap-5 text-white'>
							CART
						</h2>
						<IoMdClose
							onClick={toggleDrawer}
							className='hover:translate-x-0 opacity-60 hover:opacity-100 transition cursor-pointer'
							style={{ color: 'white', width: 25, height: 25 }}
						/>
					</div>
					{!cartItems || cartItems.length === 0 ? (
						<h2 className='text-white text-xl py-2'>Your cart is empty</h2>
					) : (
						<>
							<div className='border-b-2 border-white pb-4 mb-1 overflow-auto max-h-[500px]'>
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
								<div className='flex justify-end'>
									<button
										onClick={() => handleClearCart()}
										className='border border-white my-2 p-1 marker:hover:translate-x-0 opacity-60 text-white hover:opacity-100 transition text-sm'
									>
										Clear Cart
									</button>
								</div>
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
}
export default Drawer
