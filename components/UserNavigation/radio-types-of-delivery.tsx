import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const deliveryOptions = ['У відділення', 'У поштомат', "Кур'єром"]

export const RadioTypesOfDelivery = () => {
	return (
		<RadioGroup defaultValue={deliveryOptions[0]}>
			{deliveryOptions.map((item, index) => (
				<div key={index} className='flex items-center space-x-2'>
					<RadioGroupItem value={item} id={`r${index}`} />
					<Label htmlFor={`r${index}`}>{item}</Label>
				</div>
			))}
		</RadioGroup>
	)
}
