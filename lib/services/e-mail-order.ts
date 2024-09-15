import { formatPriceUa } from '@/lib/services/format'
import { OrderForm } from '@/lib/types/types'
import { ExtraUser, User } from '@prisma/client'

const createAddressSection = (delivery: OrderForm): string => {
	const address = delivery?.address
	return address?.typeOfDelivery === 'У відділення'
		? `<p style="font-size: 12px;">Номер відділення: ${address?.branchNumber}</p>
					<p style="font-size: 12px;">Назва відділення: ${address?.city}</p>`
		: `
									${
										address?.city
											? `<p style="font-size: 12px;">Місто: ${address?.city}</p>`
											: ''
									}
									${
										address?.street
											? `<p style="font-size: 12px;">Вулиця: ${address?.street}</p>`
											: ''
									}
									${
										address?.houseNumber
											? `<p style="font-size: 12px;">Будинок: ${address?.houseNumber}</p>`
											: ''
									}
									${
										address?.apartmentNumber
											? `<p style="font-size: 12px;">Квартира: ${address?.apartmentNumber}</p>`
											: ''
									}
									${
										address?.additionNumber
											? `<p style="font-size: 12px;">Додатковий номер: ${address?.additionNumber}</p>`
											: ''
									}
									${
										address?.zipCode
											? `<p style="font-size: 12px;">Поштовий індекс: ${address?.zipCode}</p>`
											: ''
									}
							`
}

const createItemsSection = (items: OrderForm): string => {
	return items?.item
		.map(
			item => `
					<tr>
							<td style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">
								${item.variant.name}
							</td>
							<td style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">
								${item.quantity}
							</td>
							<td style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">
								${item.variant.volume}
							</td>
							<td style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">
								${
									item.variant.discount_price
										? formatPriceUa(item.variant.discount_price)
										: formatPriceUa(item.variant.original_price)
								}
							</td>
					</tr>
			`
		)
		.join('')
}

const createUserSection = ({
	firstName,
	email,
	phone,
	lastName,
}: User): string => {
	return `
			<p style="font-size: 12px;">${firstName} ${lastName}</p>
			<p style="font-size: 12px;">${email}</p>
			<p style="font-size: 12px;">${phone}</p>
	`
}

const createExtraUserSection = (extraUser: ExtraUser | null): string => {
	if (!extraUser) return ''
	const { firstName, lastName, email, phone } = extraUser
	return `
			<p style="font-size: 12px;">${firstName || ''} ${lastName || ''}</p>
			<p style="font-size: 12px;">${email || ''}</p>
			<p style="font-size: 12px;">${phone || ''}</p>
	`
}

export const createEmailHtml = (order: OrderForm): string => {
	// Create order number
	const orderNumber = order.id.slice(-4)
	return `
		<table style="font-size: 14px; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
			<tr>
				<td colspan="2" style="text-align: center; padding: 10px 0;">
					<h1>Дякуємо за Ваше замовлення!</h1>
					<h3>Замовлення №${orderNumber} від ${new Date(
		order.createdAt
	).toLocaleDateString()}</h2>
				</td>
			</tr>
			<tr>
				<td style="padding: 10px; border-right: 1px solid #ddd; width: 50%;">
					<h3 style="color: #333; font-size: 12px;">Замовник:</h3>
					${createUserSection(order.user)}
				</td>
				<td style="padding: 10px;">
					<h3 style="color: #333; font-size: 12px; width: 50%;">Основний отримувач:</h3>
					${createExtraUserSection(order.extra_user)}
				</td>
			</tr>
			<tr>
				<td colspan="2" style="padding: 10px 0;">
					<h3 style="color: #333; font-size: 14px;">Адреса доставки:</h3>
					${createAddressSection(order)}
				</td>
			</tr>
			<tr>
				<td colspan="2" style="padding: 10px 0;">
					<h3 style="color: #333; font-size: 14px;">Товари:</h3>
					<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
						<thead>
							<tr>
								<th style="padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 12px;">Назва товару</th>
								<th style="padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 12px;">Кількість</th>
								<th style="padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 12px;">Об'єм</th>
								<th style="padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 12px;">Ціна</th>
							</tr>
						</thead>
						<tbody>
							${createItemsSection(order)}
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
				<td style="padding: 10px 0;">
					<p style="font-size: 14px;"><strong>Кількість одиниць:</strong> ${
						order.itemsTotal
					} </p>
				</td>
				<td style="padding: 10px 0;">
					<p style="font-size: 14px;"><strong>Сума замовлення:</strong> ${formatPriceUa(
						order.subTotal
					)}</p>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="padding: 10px 0;">
					<p style="font-size: 12px;"><strong>Спосіб оплати:</strong> ${
						order.payment === 'PAIMENTBYCARD'
							? 'Оплата картою'
							: 'Оплата при отриманні'
					}</p>
				</td>
			</tr>
			<tr>
				<td colspan="2" style="padding: 10px 0;">
					<p style="font-size: 12px;"><strong>Коментар до замовлення:</strong> ${
						order.comment === null ? '' : order.comment
					}</p>
				</td>
			</tr>
		</table>
			<p>З повагою,<br>Команда підтримки DayPatron<br>
			<img src="http://localhost:3000/images/DayLogo_black.svg" alt="DayPatron Logo" style="display: block; width: 150px; height: 50px;">
			</p> 
					<p style="font-size: 12px; color: #999;">телефон:  +38 (099) 730-21-26 <br>ел.пошта: daypatronteam@gmail.com <br>cайт: http://www.daypatron.com</p>
		<div>
			<p style="font-size: 12px; text-align: center; color: #999;">© 2023 DayPatron Inc. Усі права захищені</p>
		</div>
	`
}
