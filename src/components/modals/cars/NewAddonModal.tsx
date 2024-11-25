"use client"

import { useState } from "react"
import FormModal from "../formModal"
import useBasicFormHook from "@/hooks/useForm"
import { InvoiceItemList, InvoiceItemTypeT, ReqInvoiceItemI, ReqInvoiceItemSchema } from "@/interface/api/invoice"
import { NewAddon } from "@/constants/requests/cars"

const NewAddonModal = ({
    callback
}: {
    callback: (req: ReqInvoiceItemI) => Promise<boolean> | boolean
}) => {
    const [ loading, setLoading ] = useState<boolean>(false)

    const {
        values,
        setValues,
        errs,
        updateValues,
        clearValues,
    } = useBasicFormHook(
        ReqInvoiceItemSchema,
        {
            name: '',
            amount: '0',
            description: '',
            type: "Singular" as InvoiceItemTypeT
        },
        undefined,
        "add_on_form"
    )

    const handleCallback = async (): Promise<boolean> => {
        try {
            console.log(values.name)
            if (Object.keys(errs).length !== 0) {
                return false
            }
            setLoading(true)

            const req = {
                ...values,
                amount: parseInt(values.amount)
            }

            const res = await callback(req as ReqInvoiceItemI)
            
            res && clearValues()
    
            return res
        } catch {
            return false
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <FormModal
            title="Add Add-ons"
            paramKey="new_addon"
            onOk={() => handleCallback()}
            loading={ loading }
        >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 px-4 pb-4 overflow-x-hidden">
                <div
                    className="flex flex-col col-start-1 col-span-1"
                >
                    <label 
                        htmlFor="name"
                        className="font-bold text-lg"
                    >
                        Name
                    </label>
                    <input type="text" 
                        id="name"
                        value={values.name}
                        onChange={updateValues}
                        className="border-black border rounded-md p-1 text-lg"
                    />
                    <p
                        className="font-bold text-red-500"
                    >
                        {errs.name}
                    </p>
                </div>
                <div
                    className="flex flex-col col-start-2 col-span-1"
                >
                    <label 
                        htmlFor="amount"
                        className="font-bold text-lg"
                    >
                        Amount
                    </label>
                    <input type="number" 
                        id="amount"
                        value={values.amount}
                        onChange={updateValues}
                        className="border-black border rounded-md p-1 text-lg"
                    />
                    <p
                        className="font-bold text-red-500"
                    >
                        {errs.amount}
                    </p>
                </div>
                <div
                    className="flex flex-col col-start-1 col-span-2"
                >
                    <label 
                        htmlFor="description"
                        className="font-bold text-lg"
                    >
                        Description
                    </label>
                    <input type="text" 
                        id="description"
                        value={values.description}
                        onChange={updateValues}
                        className="border-black border rounded-md p-1 text-lg"
                    />
                    <p
                        className="font-bold text-red-500"
                    >
                        {errs.description}
                    </p>
                </div>
                <select 
                    name="type" 
                    id="type"
                    onChange={e => setValues(prev => ({
                        ...prev,
                        type: e.target.value as InvoiceItemTypeT
                    }))}
                    className='col-start-1 col-end-3 col-span-2 text-lg bg-slate-300 rounded-md pt-2 pb-2 mt-3'
                >
                    {InvoiceItemList.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

             </div>
        </FormModal>
    )
}

export default NewAddonModal

function callback(arg0: ReqInvoiceItemI) {
    throw new Error("Function not implemented.")
}
