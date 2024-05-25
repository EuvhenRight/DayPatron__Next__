import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Props {
	setTypeOfDelivery: React.Dispatch<React.SetStateAction<string>>
	onChange: (value: string) => void
	typeOfDelivery: string
}

const deliveryOptions = ['У відділення', "Кур'єром"]

export const RadioTypesOfDelivery = ({
	setTypeOfDelivery,
	onChange,
	typeOfDelivery,
}: Props) => {
	const toggleOnDelivery = (value: string) => {
		onChange(value)
		setTypeOfDelivery(value)
	}

	return (
		<RadioGroup value={typeOfDelivery} onValueChange={toggleOnDelivery}>
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
