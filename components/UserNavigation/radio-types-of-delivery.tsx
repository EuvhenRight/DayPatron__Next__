import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Props {
	setTypeOfDelivery: React.Dispatch<React.SetStateAction<string>>
	onChange: (value: string) => void
}

const deliveryOptions = ['У відділення', "Кур'єром"]

export const RadioTypesOfDelivery = ({
	setTypeOfDelivery,
	onChange,
}: Props) => {
	const toggleOnDelivery = (value: string) => {
		setTypeOfDelivery(value)
		onChange(value)
	}
	return (
		<RadioGroup defaultValue={deliveryOptions[0]}>
			{deliveryOptions.map((item, index) => (
				<div key={index} className='flex items-center space-x-2'>
					<RadioGroupItem
						onClick={() => toggleOnDelivery(item)}
						value={item}
						id={`r${index}`}
					/>
					<Label htmlFor={`r${index}`}>{item}</Label>
				</div>
			))}
		</RadioGroup>
	)
}
