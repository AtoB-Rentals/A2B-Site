"use client"

import { CreateUser } from "@/constants/requests/users"
import useBasicFormHook from "@/hooks/useForm"
import { reqUserInitialValues, ReqUserSchema } from "@/interface/api/user"
import { useState } from "react"
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import { DecodedTokenI } from "@/interface/api"
import parsePhoneNumberFromString from "libphonenumber-js"

function formatPhoneNumber(phone: string): string {
    try {
        const phoneNumber = parsePhoneNumberFromString(phone, 'US'); // Specify a default country if needed
        if (phoneNumber && phoneNumber.isValid()) {
          return phoneNumber.format('E.164'); // This formats to +19999999999
        }
        throw new Error('Invalid phone number');
    } catch {
        return ""
    }
}


const RentalNewUser = ({
    toggle, handleBooking
}:{
    toggle: () => void
    handleBooking: () => void
}) => {
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ password2, setPassword2 ] = useState<string>("")
    const [ password2Err, setPassword2Err ] = useState<string>("")
    
    const {
        setValues,
        values,
        updateValues,
        errs,
        validateValues,
    } = useBasicFormHook(
        ReqUserSchema,
        {
            ...reqUserInitialValues
        },
        undefined,
        "auth_user"
    )

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()
            let err = false

            const validateRes = validateValues()
            if (!validateRes) {
                err = true
            }
            if (Object.keys(errs).length) {
                err = true
            }

            if (values.password !== password2) {
                setPassword2Err("Passwords do not match")
                err = true
            } else {
                setPassword2Err("")
            }

            if (password2) {
                setPassword2("")
            }
        
            if (err) return
            await setLoading(true)

            values.phoneNumber = formatPhoneNumber(values.phoneNumber)

            const res = await CreateUser(values)
            if (res.message === "User already exists") {
                alert(res.message)
                toggle()
                return
            }

            if (res.isErr) {
                alert("invalid information provided")
                console.log("err", res.message)
                return 
            }

            const token = res.data
            await Cookies.set("tokenX", token, {expires: 1})

            const decodedToken = jwtDecode<DecodedTokenI>(token)
            localStorage.setItem("role", decodedToken.role)

            handleBooking()
        } catch (err) {
            console.error(err)
            alert("Something went wrong. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 md:grid md:grid-cols-2"
        >
            <div
                className="flex flex-col col-start-1 col-span-1"
            >
                <label 
                    htmlFor="firstName"
                    className="font-bold text-lg"
                >
                    First Name
                </label>
                <input type="text" 
                    id="firstName"
                    value={values.firstName}
                    onChange={updateValues}
                    className="border-black border rounded-md p-1 text-lg"
                />
                <p
                    className="font-bold text-red-500"
                >
                    {errs.firstName}
                </p>
            </div>
            <div
                className="flex flex-col col-start-2 col-span-1"
            >
                <label 
                    htmlFor="lastName"
                    className="font-bold text-lg"
                >
                    Last Name
                </label>
                <input type="text" 
                    id="lastName"
                    value={values.lastName}
                    onChange={updateValues}
                    className="border-black border rounded-md p-1 text-lg"
                />
                <p
                    className="font-bold text-red-500"
                >
                    {errs.lastName}
                </p>
            </div>
            <div
                className="flex flex-col col-start-1 col-span-2"
            >
                <label 
                    htmlFor="email"
                    className="font-bold text-lg"
                >
                    Email
                </label>
                <input type="text" 
                    id="email"
                    value={values.email}
                    onChange={updateValues}
                    className="border-black border rounded-md p-1 text-lg"
                />
                <p
                    className="font-bold text-red-500"
                >
                    {errs.email}
                </p>
            </div>
            <div
                className="flex flex-col col-start-1 col-span-2"
            >
                <label 
                    htmlFor="phoneNumber"
                    className="font-bold text-lg"
                >
                    Phone Number
                </label>
                <input type="text" 
                    id="phoneNumber"
                    value={values.phoneNumber}
                    onChange={updateValues}
                    className="border-black border rounded-md p-1 text-lg"
                />
                <p
                    className="font-bold text-red-500"
                >
                    {errs.phoneNumber}
                </p>
            </div>
            {/* Date of birth */}
            <div
                className="flex flex-col col-start-1 col-span-1"
            >
                <label 
                    htmlFor="password"
                    className="font-bold text-lg"
                >
                    Date of birth
                </label>
                <p
                    className="italic"
                >
                    As shown on driver's license
                </p>
                <input 
                    type="date" 
                    name="dob" 
                    id="dob"
                    value={values.dob}
                    onChange={e => {
                        e.preventDefault()

                        setValues(prev => ({
                            ...prev,
                            dob: e.target.value.trim()
                        }))
                    }}
                    className="border-black border rounded-md p-1"
                />
                <p
                    className="font-bold text-red-500"
                >
                    {errs.dob}
                </p>
            </div>

            <div
                className="flex flex-col col-start-1 col-span-1"
            >
                <label 
                    htmlFor="password"
                    className="font-bold text-lg"
                >
                    Password
                </label>
                <input type="password" 
                    id="password"
                    value={values.password}
                    onChange={updateValues}
                    className="border-black border rounded-md p-1 text-lg"
                />
                <p
                    className="font-bold text-red-500"
                >
                    {errs.password}
                </p>
            </div>
            <div
                className="flex flex-col col-start-2 col-span-1"
            >
                <label 
                    htmlFor="password2"
                    className="font-bold text-lg"
                >
                    Password Again
                </label>
                <input type="password" 
                    id="password2"
                    value={password2}
                    onChange={e => {
                        e.preventDefault()
                        setPassword2(e.target.value)
                    }}
                    className="border-black border rounded-md p-1 text-lg"
                />
                <p
                    className="font-bold text-red-500"
                >
                    {password2Err}
                </p>
            </div>
            <button
                className="p-2 font-bold text-2xl rounded-md bg-blue-600 border-black hover:border-2 w-full text-white col-satrt-1 col-span-2"
            >
                Book
            </button>
        </form>
    )
}

export default RentalNewUser