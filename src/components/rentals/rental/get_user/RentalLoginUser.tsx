"use client"

import { FormEvent, useState } from "react"
import { isEmail } from 'validator'
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { DecodedTokenI } from "@/interface/api"

const RentalLoginUser = ({
    handleBooking
}:{
    handleBooking: () => void
}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let err = false

        if (!isEmail(email)) {
            setError("Invalid email")
            err = true
        }

        if (password === "") {
            setError("Password required" )
            err = true
        }

        if (err) return
        setError("")

        try {
            setLoading(true)

            const res = await fetch(`${process.env.NEXT_PUBLIC_API!}/api/users/login`, { // Replace '/api/login' with your actual login endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })

            if (res.status === 401 || res.status === 403) {
                setError("Not authorized")
                return
            }

            if (!res.ok) {
                const errorData = await res.json()
                setError(errorData.error || "Login failed")
                return
            }

            const data = await res.json()

            const token = data.data as string
            Cookies.set("tokenX", token, {expires: 1})

            const decodedToken = jwtDecode<DecodedTokenI>(token)
            localStorage.setItem("role", decodedToken.role)

            handleBooking()
        } finally {
            setLoading(false)
        }
    }

    return (
        <form 
            onSubmit={e => handleLogin(e)}
            className="mx-auto mt-2 flex flex-col gap-6 px-10"
        >
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
                    value={email}
                    onChange={e => {
                        e.preventDefault()
                        setEmail(e.target.value)
                    }}
                    className="border-black border rounded-md p-1 text-lg"
                />
            </div>
            <div
                className="flex flex-col col-start-1 col-span-2"
            >
                <label 
                    htmlFor="password"
                    className="font-bold text-lg"
                >
                    Password
                </label>
                <input type="password" 
                    id="password"
                    value={password}
                    onChange={e => {
                        e.preventDefault()
                        setPassword(e.target.value)
                    }}
                    className="border-black border rounded-md p-1 text-lg"
                />
            </div>
            <div
                className="flex flex-col col-start-1 col-span-2"
            >
                <p
                    className="text-red-500 font-bold text-center"
                >
                    {error}
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

export default RentalLoginUser