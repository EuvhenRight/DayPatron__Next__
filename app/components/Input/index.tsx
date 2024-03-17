import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface InputProps {
	id: string
	label: string
	type: string
	disabled?: boolean
	required?: boolean
	register?: UseFormRegister<FieldValues>
	errors?: FieldErrors
	errorMessage?: string
}

const Input: React.FC<InputProps> = ({
	id,
	label,
	type,
	disabled,
	required,
	register,
	errors,
	errorMessage,
}) => {
	return (
		<div className='w-full relative'>
			<input
				id={id}
				type={type}
				disabled={disabled}
				{...register!(id, {
					required,
				})}
				placeholder=''
				className={`peer input input-bordered input-lg w-full outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4
        ${
					(errors && errors[id]) || errorMessage
						? 'focus:input-error input-error'
						: 'focus:border-slate-400'
				}	
    `}
			/>
			<label
				htmlFor={id}
				className={`absolute cursor-text text-sm duration-150 transform -translate-y-4 top-3 z-10 origin-[0] left-5 pt-2 text-md pl-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:border-primary
			${
				(errors && errors[id]) || errorMessage
					? 'text-error input-primary'
					: 'text-zinc-400'
			}`}
			>
				{label}
			</label>
			{errors && errors[id] && (
				<p className='text-error text-sm pt-3'>
					{errors[id]?.message?.toString()}
				</p>
			)}
		</div>
	)
}

export default Input
