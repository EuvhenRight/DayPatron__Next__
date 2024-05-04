'use client'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet'
import { useSession } from 'next-auth/react'
import { AiOutlineClose, AiOutlineShoppingCart } from 'react-icons/ai'
import { getCart } from './api-cart'

export const Drawer = () => {
	const { data: session } = useSession()

	const dataCart = getCart(session?.user?.id!)

	return (
		<Sheet>
			<SheetTrigger className='w-8 h-8 cursor-pointer relative'>
				<AiOutlineShoppingCart className='w-full h-full' />
				{/* CART INDICATOR */}
				<span className='inline-flex rounded-full h-4 w-4 bg-red-500 absolute top-0 right-0 border border-white'></span>
			</SheetTrigger>
			<SheetContent>
				<div
					className={`bg-neutral-700 absolute top-0 right-0 h-full w-full sm:w-96 z-50 p-4 flex flex-col overflow-auto`}
				>
					{/* FIRST PART CART */}
					<div>
						<div className='flex gap-5 justify-between items-center border-b-2 border-white pb-4 mb-1'>
							<h2 className='text-3xl font-bold flex items-center gap-5 text-white'>
								CART
							</h2>
							<SheetClose>
								<Button
									variant='ghost'
									className='text-gray-300 transition-transform translate-x-2'
								>
									<AiOutlineClose className='w-6 h-6' />
								</Button>
							</SheetClose>
						</div>
						{/* IF CART IS EMPTY */}
						{0 === 0 ? (
							<h2 className='text-white text-lg md:text-xl py-2'>
								Your cart is empty
							</h2>
						) : (
							<>
								<div className='border-b-2 border-white pb-4 mb-1 overflow-auto max-h-[400px] sm:max-h-[500px]'>
									{/* {cartItems.map((item, index) => (
									<CartItem
										toggleDrawer={toggleDrawer}
										key={index}
										item={item}
									/>
								))} */}
								</div>
								{/* SECOND PART CHECKOUT */}
								<div className='relative'>
									{/* SUBTOTAL AND DISCOUNT */}
									{/* <div className='flex flex-col text-white py-4 mb-4'>
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
								</div> */}
									{/* CHECKOUT */}
									<button className='w-full text-white text-xl py-2 transition ease-in-out delay-350 animate-pulse'>
										Checkout
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
