import type { ProductInCart } from '@/app/lib/types/types'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

type CartContextType = {
	cartTotalQuantity: number
	showToast: boolean
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
	const [showToast, setShowToast] = useState<boolean>(false)

	useEffect(() => {
		const localCard: any = localStorage.getItem('ProductDayPatron')
		const cart = JSON.parse(localCard)
		setCartItems(cart)
	}, [])

	const handleAddToCart = useCallback((product: ProductInCart) => {
		let clear: NodeJS.Timeout // Define clear variable in the outer scope
		setCartItems(prev => {
			let updateCartItems
			if (prev) {
				updateCartItems = [...prev, product]
			} else {
				updateCartItems = [product]
			}
			setShowToast(true) // Show the toast when a new item is added to the cart
			clear = setTimeout(() => {
				setShowToast(false) // Hide the toast after 3 seconds
			}, 3000)

			localStorage.setItem('ProductDayPatron', JSON.stringify(updateCartItems))
			return updateCartItems
		})
		return () => clearTimeout(clear)
	}, [])

	const value = {
		cartTotalQuantity,
		cartItems,
		handleAddToCart,
		showToast,
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
