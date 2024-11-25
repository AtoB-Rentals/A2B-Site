import { InputHTMLAttributes } from "react"


const FormInput1 = ({
    labelName,
    inputProps,
}: {
    labelName: string,
    inputProps: InputHTMLAttributes<HTMLInputElement>
}) => {

    return (
        <div className={`relative w-full`}>
            <input 
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-600 border-solid appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                {...inputProps}
                placeholder=" "
            />
            <label 
                htmlFor={inputProps.name} 
                className="absolute text-lg text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/3 rtl:peer-focus:left-auto start-1"
            >
                {labelName}
            </label>
        </div>
    )
}

export default FormInput1