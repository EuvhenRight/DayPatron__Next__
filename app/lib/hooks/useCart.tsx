import type { ProductInCart } from '@/app/lib/types/types'
import { createContext, useCallback, useContext, useState } from 'react'

type CartContextType = {
	cartTotalQuantity: number
	cartItems: ProductInCart[] | null
	handleAddToCart: (product: ProductInCart) => void
	// removeFromCart: (product: Product) => void
	// clearCart: () => void
}

export const CartContext = createContext<CartContextType | null>(null)

interface Props {
	[propsName: string]: any
}
export const CartContextProvider = (props: Props) => {
	const [cartTotalQuantity, setCartTotalQuantity] = useState(0)
	const [cartItems, setCartItems] = useState<ProductInCart[] | null>(null)

	const handleAddToCart = useCallback((product: ProductInCart) => {
		setCartItems(prev => {
			let updateCartItems
			if (prev) {
				updateCartItems = [...prev, product]
			} else {
				updateCartItems = [product]
			}

			return updateCartItems
		})
	}, [])

	const value = {
		cartTotalQuantity,
		cartItems,
		handleAddToCart,
	}

	return <CartContext.Provider value={value} {...props} />
}

export const useCart = () => {
	const context = useContext(CartContext)

	if (!context) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}
