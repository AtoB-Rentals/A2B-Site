'use client'
import FormInput1 from "@/components/assets/formInput1"
import { FormEvent, useState } from "react";
import {isEmail} from "validator"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { DecodedTokenI } from "@/interface/api";
import { jwtDecode } from "jwt-decode";
import { ManCredentialsForm } from "@/components/auth/ManagerLogin";



const ManagerLogin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault(); // Prevent the default form submission

        if (!isEmail(email)) {
            return setError("invalid email")
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API!}/api/manager/login`, { // Replace '/api/login' with your actual login endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.status === 401 || response.status === 403) {
                setError("Not authorized")
                return
            }

            if (!response.ok) {
                const errorData = await response.json()
                setError(errorData.error || "Login failed")
                return;
            }

            const data = await response.json()

            const token = data.data as string
            Cookies.set("tokenX", token, {expires: 1})

            const decodedToken = jwtDecode<DecodedTokenI>(token)
            localStorage.setItem("role", decodedToken.role)

            setError("")
            router.push('/manager/cars')


            // You can store the token in localStorage, cookies, or context here if needed
            // For example: localStorage.setItem("token", data.token);

            // Redirect or update the UI to show a logged-in state
        } catch (error) {
            console.error("Error during login:", error)
            setError("An error occurred. Please try again.")
        }
    }

    return(
        <main
            className="w-full flex flex-col items-center justify-center min-h-screen py-2"
        >
            <div
                className="flex flex-col items-center w-full mx-4 md:w-1/3 p-10 shadow-md"
            >
                <h1
                    className="mt-10 mb-4 text-4xl font-bold"
                >
                    Manager login
                </h1>
                <ManCredentialsForm />
            </div>
        </main>
    )
}

export default ManagerLogin