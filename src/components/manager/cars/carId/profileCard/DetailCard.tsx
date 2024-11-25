import Link from "next/link"
import { HTMLInputTypeAttribute, useState } from "react"

type InputEvents = React.ChangeEvent<
    HTMLInputElement |
    HTMLTextAreaElement |
    HTMLSelectElement
>

const DetailCard = ({
    title,
    inputType,
    name,
    options,
    preValue,
    onSave,
    children,
    customClick,
    link
}:{
    title: string
    inputType?: HTMLInputTypeAttribute | "select" | "popup"
    name?: string
    options?: string[]
    preValue?: string
    onSave?: (v: string) => void
    children: React.ReactNode
    /**Instead of editting full */
    customClick?: () => void
    link?: string
}) => {
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ edit, setEdit ] = useState<boolean>(false)
    const [ value, setValue ] = useState<string>(preValue || "")

    name = name || title
    options = options || []
    
    let editable = !!inputType
    let select = inputType === "select"

    const handleOnChange = (e: InputEvents) => {
        e.preventDefault()
        setValue(e.target.value)
    }

    const handleSave = async () => {
        if (!onSave) return
        setLoading(true)
        await onSave(value)
        setLoading(false)
        setEdit(false)
    }

    let cursor = false
    if (!edit) {
        if (editable || !!customClick) {
            cursor = true
        }
    }

    return (
        <div 
            className={`relative capitalize h-32 bg-slate-300 rounded-md p-3 ${cursor && "cursor-pointer"}`}
            onClick={() => {
                if (!!customClick) return customClick()
                editable && setEdit(true)
            }}
        >
            {link && <Link
                href={link}
                target="_blank"
                className="absolute top-0 right-0 z-20"
            >
              Go to  
            </Link>}
            <div
                className="flex flex-col h-full"
            >

                <p className="font-bold">{ title }</p>
                {loading && <p className="font-bold">
                    loading...
                </p>}
                {!loading && <div className="flex flex-col justify-between h-full overflow-hidden text-ellipsis">
                    {!edit && children }
                    {edit && !select && <div>
                        <input 
                            type={ inputType } 
                            name={name} 
                            id={name} 
                            onChange={e => handleOnChange(e)}
                            value={value}
                        /> 
                        
                    </div>}
                    {edit && select && <div>
                        <select 
                            name={name} 
                            id={name}
                            onChange={e => handleOnChange(e)}
                            value={value}
                        >
                            {
                                options.map(opt => (
                                    <option key={opt}>
                                        {opt}
                                    </option>
                                ))
                            }
                        </select>
                    </div>}
                    {edit && <button
                        className="bg-blue-600 text-white font-bold rounded-md py-1"
                        onClick={() => handleSave()}
                    >
                        Save
                    </button>}
                </div>}
            </div>
        </div>
    )
}

export default DetailCard