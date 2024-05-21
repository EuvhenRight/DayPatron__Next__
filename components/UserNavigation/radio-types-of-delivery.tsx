import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Props {
	setTypeOfDelivery: React.Dispatch<React.SetStateAction<number>>
}

const deliveryOptions = ['У відділення', "Кур'єром"]

export const RadioTypesOfDelivery = ({ setTypeOfDelivery }: Props) => {
	const toggleOfDelivery = (value: number) => {
		setTypeOfDelivery(value)
	}

	return (
		<RadioGroup defaultValue={deliveryOptions[0]}>
			{deliveryOptions.map((item, index) => (
				<div key={index} className='flex items-center space-x-2'>
					<RadioGroupItem
						onClick={() => toggleOfDelivery(index)}
						value={item}
						id={`r${index}`}
					/>
					<Label htmlFor={`r${index}`}>{item}</Label>
				</div>
			))}
		</RadioGroup>
	)
}
