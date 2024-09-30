'use client'
import { CartItemComponent } from '@/components/Cart-item/CartItem'
import { PriceTag } from '@/components/PriceTag'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetOverlay,
	SheetTrigger,
} from '@/components/ui/sheet'
import { CartWithVariants } from '@/lib/types/types'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useRef } from 'react'
import { AiOutlineClose, AiOutlineShoppingCart } from 'react-icons/ai'
import { toast } from 'sonner'
interface Props {
	cart?: CartWithVariants | null
}

export const Drawer: React.FC<Props> = ({ cart }) => {
	const session = useSession()

	// CART INDICATOR
	const cartIndicate = cart ? cart.items.length > 0 : false
	const router = useRouter()
	const sheetCloseRef = useRef<HTMLButtonElement>(null)
	// TOGGLE DRAWER
	const toggleDrawer = () => {
		if (session.status !== 'authenticated') {
			if (sheetCloseRef.current) {
				sheetCloseRef.current.click()
			}
			toast.warning('Вам необхідно авторизуватись!')
		}
		router.push('/checkouts')
	}

	return (
		<Sheet>
			<SheetTrigger className='w-8 h-8 cursor-pointer relative text-white'>
				<AiOutlineShoppingCart className='w-full h-full' />
				{/* CART INDICATOR */}
				{cartIndicate && (
					<span className='inline-flex rounded-full h-4 w-4 bg-red-500 absolute top-0 right-0 border border-white'></span>
				)}
			</SheetTrigger>
			<SheetOverlay className='z-50 bg-black/50' />
			{/* DRAWER FULL SCREEN IN MOBILE */}
			<SheetContent className='w-full'>
				<div
					className={`bg-neutral-700 absolute top-0 right-0 h-full w-full sm:w-96 z-50 p-4 flex flex-col overflow-auto`}
				>
					{/* FIRST PART CART */}
					<div>
						<div className='flex gap-5 justify-between items-center border-b-2 border-white pb-4 mb-1'>
							<h2 className='text-3xl font-bold flex items-center gap-5 text-white'>
								КОШИК
							</h2>
							<SheetClose
								className='text-gray-300 hover:text-white'
								ref={sheetCloseRef}
							>
								<AiOutlineClose className='w-6 h-6' />
							</SheetClose>
						</div>
						{/* IF CART IS EMPTY */}
						{!cartIndicate ? (
							<h2 className='text-white text-lg md:text-xl py-2'>
								Ваш кошик порожній
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
									<div className='flex flex-col text-white py-4 mb-2'>
										<div className='flex justify-between py-4'>
											<h2>Сума замовлення</h2>
											<h2
												className={
													cart?.discountTotal! > 0 ? 'line-through' : ''
												}
											>
												<PriceTag price={cart?.originalTotal!} />
											</h2>
										</div>
										<div className='flex justify-between'>
											<h2>Знижка</h2>
											<h2 className='text-green-500'>
												-{<PriceTag price={cart?.discountTotal!} />}
											</h2>
										</div>
										<div className='flex justify-between py-2'>
											<h2>До оплати без доставки:</h2>
											<h2>{<PriceTag price={cart?.subTotal!} />}</h2>
										</div>
									</div>
									{/* CHECKOUT */}
									<Button
										variant='destructive'
										size='lg'
										className='w-full text-white text-xl py-2 transition ease-in-out delay-350'
										onClick={toggleDrawer}
									>
										Оформити замовлення
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
