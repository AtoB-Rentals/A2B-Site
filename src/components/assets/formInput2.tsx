import { withMask } from 'use-mask-input'

type InputEvents = React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >

interface InputI {
    id: string
    name: string
    updateValue: (e: InputEvents) => void
    value: string | number
    error?: string | null | undefined
    placeHolder?: string
    fullWidth?: boolean
    mask?: string
    maskOptions?: object
}

const Input2: React.FC<InputI> = ({
    id,
    name,
    updateValue,
    value,
    error,
    placeHolder,
    fullWidth,
    mask,
    maskOptions
}: InputI) => {
    

    const full = 'col-start-1 col-span-2'
    const useTheMask = mask === '' || !!mask
    return (
        <div
            className={`flex flex-col ${fullWidth && full} text-left px-1`}
        >
            <label htmlFor={id} className='mb-1 text-lg'>
                {name}
            </label>
            <input 
                type="text"
                id={id}
                className='font-lg px-1 border-2 border-neutral-900 dark:border-lime-500 rounded-md py-0.5'
                placeholder={placeHolder}
                value={value}
                onChange={e => updateValue(e)}
                ref={useTheMask ? withMask(mask, maskOptions) : mask}
            />
            <p className='font-bold text-red-500'>{error}</p>
        </div>
    )
}

export default Input2