'use client'
import FormInput1 from "@/components/assets/formInput1"
import { FormEvent, useState } from "react";
import {isEmail} from "validator"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";



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
        <main>
            <section className="my-6 mx-3 md:mx-auto max-w-[800px] rounded-2xl shadow-[0px_0px_12px_3px] py-8 shadow-neutral-500">
                <h2 className="text-center text-3xl">
                    Manager Login
                </h2>
                <form 
                    onSubmit={e => handleLogin(e)}
                    className=" mx-auto mt-2 flex flex-col gap-6 px-10"
                >
                    <FormInput1 
                        labelName="Email"
                        inputProps={{
                            name:"email",
                            required: true,
                            type: "text",
                            "aria-required": true,
                            value: email,
                            onChange: e => setEmail(e.target.value)
                        }}
                    />
                    <FormInput1 
                        labelName="Password"
                        inputProps={{
                            name:"password",
                            required: true,
                            type: "password",
                            "aria-required": true,
                            value: password,
                            onChange: e => setPassword(e.target.value)
                        }}
                    />

                    {error && (
                        <p className="text-red-500 text-center">
                            {error}
                        </p>
                    )}
                    
                    <button 
                        type="submit"
                        className="w-full p-5 bg-orange-500 rounded-lg"
                    >
                        Login
                    </button>
                </form>
            </section>
        </main>
    )
}

export default ManagerLogin