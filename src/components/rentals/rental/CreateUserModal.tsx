"use client"

import FormModal from "@/components/modals/formModal"
import { CreateUser } from "@/constants/requests/users"
import useBasicFormHook from "@/hooks/useForm"
import { ReqUserI, ReqUserSchema } from "@/interface/api/user"
import { parsePhoneNumber } from "libphonenumber-js"
import { useState } from "react"
import Cookies from "js-cookie"

const CreateUserModal = ({
    title, callback, paramKey
}: {
    title: string
    callback: () => void
    paramKey: string
}) => {
    const [ loading, setLoading ] = useState<boolean>(false)
    const {
        values,
        setValues,
        updateValues,
        errs,
        validateValues
    } = useBasicFormHook(
        ReqUserSchema,
        {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            dob: '',
        },
        undefined,
        "user_creation_form"
    )

    const handleSubmit = async (): Promise<boolean> => {
        validateValues()
        if (Object.keys(errs).length) {
            return false
        }

        try {
            await setLoading(true)
            values.phoneNumber = parsePhoneNumber(values.phoneNumber, 'US').format('E.164')

            const res = await CreateUser(values)
            if (res.isErr) {
                alert("something went wrong")
                return false
            }

            const token = res.data as string
            Cookies.set("tokenX", token, {expires: 1})

            return true
        } catch {
            alert("Something went wrong")
            return false
        } finally {
            setLoading(false)
        }
    }

    return (
        <FormModal 
            title={title} 
            onOk={() => handleSubmit()} 
            paramKey={paramKey} 
            loading={false}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 px-4 pb-4 p-2">
                <div
                    className={`flex flex-col text-left`}
                >
                    <label htmlFor="firstName" className='mb-1 text-lg'>
                        First Name
                    </label>
                    <input 
                        type="text"
                        id="firstName"
                        className='font-lg px-1 border-2 border-neutral-900 dark:border-lime-500 rounded-md py-0.5'
                        value={values.firstName}
                        onChange={updateValues}
                    />
                    <p className={`font-bold text-red-500 ${!errs.firstName && 'invisible'}`}>{errs.firstName}</p>
                </div>
                <div
                    className={`flex flex-col text-left`}
                >
                    <label htmlFor="lastName" className='mb-1 text-lg'>
                        Last Name
                    </label>
                    <input 
                        type="text"
                        id="lastName"
                        className='font-lg px-1 border-2 border-neutral-900 dark:border-lime-500 rounded-md py-0.5'
                        value={values.lastName}
                        onChange={updateValues}
                    />
                    <p className={`font-bold text-red-500 ${!errs.lastName && 'invisible'}`}>{errs.lastName}</p>
                </div>
                <div
                    className={`flex flex-col text-left`}
                >
                    <label htmlFor="phoneNumber" className='mb-1 text-lg'>
                        Phone Number
                    </label>
                    <input 
                        type="text"
                        id="phoneNumber"
                        className='font-lg px-1 border-2 border-neutral-900 dark:border-lime-500 rounded-md py-0.5'
                        value={values.phoneNumber}
                        onChange={updateValues}
                    />
                    <p className={`font-bold text-red-500 ${!errs.phoneNumber && 'invisible'}`}>{errs.phoneNumber}</p>
                </div>
                <div
                    className={`flex flex-col text-left`}
                >
                    <label htmlFor="email" className='mb-1 text-lg'>
                        Email
                    </label>
                    <input 
                        type="text"
                        id="email"
                        className='font-lg px-1 border-2 border-neutral-900 dark:border-lime-500 rounded-md py-0.5'
                        value={values.email}
                        onChange={updateValues}
                    />
                    <p className={`font-bold text-red-500 ${!errs.email && 'invisible'}`}>{errs.email}</p>
                </div>
            </div>
        </FormModal>
    )
}

export default CreateUserModal