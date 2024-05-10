'use client'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet'
import CurrentUser from '@/lib/hooks/currentUser'
import { Cart } from '@/lib/types/types'
import { User } from '@prisma/client'
import { AiOutlineClose, AiOutlineShoppingCart } from 'react-icons/ai'
import { CartItemComponent } from '../Cart-item/CartItem'
import PriceTag from '../PriceTag'

interface Props {
	cart: Cart
}

export const Drawer = ({ cart }: Props) => {
	// CURRENT USER
	const user = CurrentUser() as User | null

	// CART INDICATOR
	if (!cart) return null
	const cartIndicate = cart.items.length > 0

	return (
		<Sheet>
			<SheetTrigger className='w-8 h-8 cursor-pointer relative'>
				<AiOutlineShoppingCart className='w-full h-full' />
				{/* CART INDICATOR */}
				{cartIndicate && (
					<span className='inline-flex rounded-full h-4 w-4 bg-red-500 absolute top-0 right-0 border border-white'></span>
				)}
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
						{!cartIndicate ? (
							<h2 className='text-white text-lg md:text-xl py-2'>
								Your cart is empty
							</h2>
						) : (
							<>
								<div className='border-b-2 border-white pb-4 mb-1 overflow-auto max-h-[400px] sm:max-h-[500px]'>
									{cart?.items.map((item, index) => (
										<CartItemComponent key={index} item={item} />
									))}
								</div>
								{/* SECOND PART CHECKOUT */}
								<div className='relative'>
									{/* SUBTOTAL AND DISCOUNT */}
									<div className='flex flex-col text-white py-4 mb-4'>
										<div className='flex justify-between'>
											<h2>SUBTOTAL</h2>
											<h2>{<PriceTag price={cart?.subTotal!} />}</h2>
										</div>
										<div className='flex justify-between'>
											<h2>DISCOUNT</h2>
											<h2 className='text-green-500'>
												-{<PriceTag price={cart?.itemsTotal!} />}
											</h2>
										</div>
									</div>
									{/* CHECKOUT */}
									<Button
										variant='destructive'
										size='sm'
										className='w-full text-white text-xl py-2 transition ease-in-out delay-350 animate-pulse'
									>
										Checkout
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
