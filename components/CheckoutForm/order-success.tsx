import { Handshake } from 'lucide-react'

export const OrderSuccess = () => {
	return (
		<div className='text-lg font-bold flex gap-2 my-4'>
			<Handshake size={32} />
			Ваше замовлення успішно виконано, і команда DayPatron незабаром його
			перевірить!
		</div>
	)
}
