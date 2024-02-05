'use client'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import CartItem from '../CartItem'

interface Props {
	toggleDrawer: () => void
}
function Drawer({ toggleDrawer }: Props) {
	const [emptyCart, setEmptyCart] = useState(false)
	// const [totalPrice, setTotalPrice] = useState<number>(0)

	// useEffect(() => {
	// 	// Calculate total price whenever cart items change
	// 	const newTotalPrice = cartItems.reduce((sum, item) => {
	// 		return sum + item.quantity * item.product.price // Assuming Product has a 'price' field
	// 	}, 0)

	// 	setTotalPrice(newTotalPrice)
	// }, [cartItems])

	const handleQuantityChange = (itemId: string, newQuantity: number) => {
		// You need to implement a function to update the quantity of a cart item
		// This function should interact with your backend to update the quantity in the database
		// For simplicity, let's assume you have a function called updateCartItemQuantity
		// updateCartItemQuantity(itemId, newQuantity);
	}

	return (
		<div className='fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 z-10'>
			<div className='bg-[--colorDrawers] fixed top-0 right-0 h-full w-96 z-20 p-4 flex flex-col'>
				{emptyCart ? (
					<h2 className='text-white'>Your cart is empty</h2>
				) : (
					<>
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
							<div className='border-b-2 border-white pb-4 mb-1 overflow-auto max-h-[500px]'>
								{/* Replace these placeholders with your CartItem data */}
								<CartItem key={1} />
								<CartItem key={2} />
								<CartItem key={3} />
								<CartItem key={4} />
								<CartItem key={5} />
							</div>
						</div>
						{/* SECOND PART CHECKOUT */}
						<div>
							<div className='flex justify-around text-white py-4 mb-4'>
								<h2>SUBTOTAL</h2>
								<h2>$1500.00</h2>
							</div>
							<button className='w-full bg-btnPrimary text-white py-2 transition ease-in-out delay-350 animate-pulse'>
								Checkout
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default Drawer
