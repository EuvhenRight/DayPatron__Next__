// components/CartItem.tsx
'use client'
import CurrentUser from '@/lib/hooks/currentUser'
import { CartItem } from '@/lib/types/types'
import { User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineClose } from 'react-icons/ai'
import PriceTag from '../PriceTag'

interface CartItemProps {
	item: CartItem
}

export const CartItemComponent = ({ item }: CartItemProps) => {
	const user = CurrentUser() as User | null

	const deleteCartItem = async (userId: string, itemId: string) => {
		if (itemId) {
			const res = await fetch(
				`http://localhost:3000/api/cart/${userId}/delete`,
				{
					method: 'DELETE',
					body: JSON.stringify({ id: itemId }),
				}
			)
			if (res.status === 200) {
				return res.json()
			}
		}
	}
	console.log(item)

	return (
		<div className='flex flex-row text-white py-2 w-full justify-between border-b-2 border-black'>
			{/* CLICK TO PRODUCT DETAILS */}
			<Link href={`/products/${item.productId}/details`}>
				<Image
					onClick={() => {}}
					className='w-20'
					width={100}
					height={100}
					src={`/images/${item.image}`}
					alt={item.image}
				/>
			</Link>
			<div className='w-full flex flex-col justify-between ml-4'>
				<div className='flex justify-between items-center'>
					<h2 className='text-typeCollectionTitle'>{item.name}</h2>
					{/* REMOVE ONE CART ITEM FROM CART */}
					<AiOutlineClose
						onClick={() => {
							deleteCartItem(user?.id!, item.id)
						}}
						className='hover:translate-x-0 opacity-60 hover:opacity-100 transition cursor-pointer'
						style={{ color: 'white', width: 20, height: 20 }}
					/>
				</div>
				{/* SIZE */}
				<div className='flex gap-2'>
					<h4>Size:</h4>
					<h4>{item.volume}</h4>
				</div>
				<div className='flex justify-between'>
					<div className='flex border border-white text-sm'>
						{/* QUANTITY */}
						<button
							onClick={() => {}}
							className='hover:bg-white hover:text-gridOverlay px-2'
						>
							{/* MINUS ICON */}
							<Image
								className='w-3'
								width={20}
								height={20}
								src='/icons/minus-sign.svg'
								alt='minus_icon'
							/>
						</button>
						<h4 className='p-1'>{item.quantity}</h4>
						<button
							onClick={() => {}}
							className='hover:bg-white hover:text-gridOverlay px-2'
						>
							{/* PLUS ICON */}
							<Image
								className='w-3 fill-white hover:fill-black'
								width={20}
								height={20}
								src='/icons/add-plus.svg'
								alt='plus_icon'
							/>
						</button>
					</div>
					{/* PRICE */}
					{/* DISCOUNT ON/OFF */}
					{item.discount_price! > 0 ? (
						<p className='text-green-500 font-bold'>
							{<PriceTag price={item.discount_price!} />}
						</p>
					) : (
						<h4>{<PriceTag price={item.original_price} />}</h4>
					)}
				</div>
			</div>
		</div>
	)
}
