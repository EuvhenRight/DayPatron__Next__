// components/CartItem.tsx
'use client'

// interface CartItemProps {
// 	cartItem: CartItemModel
// 	onQuantityChange: (itemId: string, newQuantity: number) => void
// }

const CartItem = () => {
	// const handleQuantityChange = (newQuantity: number) => {
	// 	// Notify the parent component (Cart) about the quantity change
	// 	onQuantityChange(cartItem.id, newQuantity)
	// }

	return (
		<div className='flex flex-row text-white p-3 w-full justify-between border-b-2 border-black'>
			<img
				className='w-24 bg-white'
				src='/images/Carbon-killer-100ml.png'
				alt=''
			/>
			<div className='w-full flex flex-col justify-between ml-4'>
				<h2 className='text-typeCollectionTitle'>Carbon killer</h2>
				<div className='flex gap-2'>
					<h4>Size:</h4>
					<h4>100 ml</h4>
				</div>
				<div className='flex justify-between'>
					<div className='flex border border-white text-sm'>
						<button className='hover:bg-white hover:text-gridOverlay px-2'>
							<img
								className='w-3'
								src='/icons/minus-sign.svg'
								alt='minus_icon'
							/>
						</button>
						<h4 className='p-2'>1</h4>
						<button className='hover:bg-white hover:text-gridOverlay px-2'>
							<img
								className='w-3 fill-white hover:fill-black'
								src='/icons/add-plus.svg'
								alt='plus_icon'
							/>
						</button>
					</div>
					<h4>$99.99</h4>
				</div>
			</div>
		</div>
	)
}
export default CartItem
