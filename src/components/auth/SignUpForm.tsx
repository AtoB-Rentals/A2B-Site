'use client'
import { CreateUser } from "@/constants/requests/users"
import useBasicFormHook from "@/hooks/useForm"
import { reqUserInitialValues, ReqUserSchema } from "@/interface/api/user"
import parsePhoneNumberFromString from "libphonenumber-js"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

const SignUpForm = () => {
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ password2, setPassword2 ] = useState<string>("")
    const [ password2Err, setPassword2Err ] = useState<string>("")
    const [ error, setError ] = useState<string>("")
    const router = useRouter()
    const session = useSession()

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

            values.password = values.password.trim()
            await setPassword2(password2.trim())

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
                router.push('/login')
                return
            }

            if (res.isErr) {
                console.log("err", res.message)
                setError(res.message)
                return 
            }

            signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            // turn this into a hook
            // handleBooking()
        } catch (err) {
            console.error(err)
            alert("Something went wrong. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(session.status === 'authenticated') {
            const redirect = localStorage.getItem("redirectURL") || "/"
            localStorage.removeItem('redirectURL')

            router.push(redirect)
        }
    }, [session])


    return (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 md:grid md:grid-cols-2"
        >
            {error && (
                <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md col-start-1 col-span-2">
                {error}
                </span>
            )}

            <div>
                <input 
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    id="firstName"
                    onChange={updateValues}
                    value={values.firstName}
                    className="input input-primary input-lg input-bordered w-full"
                />
                <p className="font-bold text-error">
                    {errs.firstName}
                </p>
            </div>
            <div>
                <input 
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    id="lastName"
                    onChange={updateValues}
                    value={values.lastName}
                    className="input input-primary input-lg input-bordered w-full"
                />
                <p className="font-bold text-error">
                    {errs.lastName}
                </p>
            </div>

            <div className="col-start-1 col-span-2">
                <label className="input input-primary input-bordered input-lg flex items-center gap-2 col-start-1 col-span-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Email"
                        id="email"
                        value={values.email}
                        onChange={updateValues}
                    />
                </label>
                <p className="font-bold text-error">
                    {errs.email}
                </p>
            </div>

            <div>
                <input 
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    id="phoneNumber"
                    onChange={updateValues}
                    value={values.phoneNumber}
                    className="input input-primary input-lg input-bordered w-full"
                />
                <p className="font-bold text-error">
                    {errs.phoneNumber}
                </p>
            </div>

            <div className="col-start-1">
                <label htmlFor="dob">
                    Date of birth
                </label>
                <p
                    className="italic opacity-60"
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
                    className="input input-primary input-bordered input-md w-full"
                />
                <p className="font-bold text-error">
                    {errs.dob}
                </p>
            </div>
            
            
            <div className="col-start-1">
                <label className="input input-primary input-bordered flex items-center gap-2 col-start-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd" />
                    </svg>
                    <input 
                        type="password" 
                        className="grow"
                        id="password"
                        placeholder="Password"
                        onChange={updateValues}
                        value={values.password}
                    />
                </label>
                <p
                    className="font-bold text-error"
                >
                    {errs.password}
                </p>
            </div>
            <div>
                <label className="input input-primary input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd" />
                    </svg>
                    <input 
                        type="password" 
                        placeholder="Password Again"
                        onChange={e => {
                            e.preventDefault()
                            setPassword2(e.target.value)
                        }}
                        value={password2}
                        className="grow"
                    />
                </label>
                <p className="font-bold text-error">
                    {password2Err}
                </p>
            </div>

            <Link href="/login" className="text-primary underline">
                Login
            </Link>

            <button
                type="submit"
                className="btn btn-primary text-lg w-full col-start-1 col-span-2"
            >
                Sign Up
            </button>
        </form>
    )
}

export default SignUpForm