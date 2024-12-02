"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

interface CredentialsFormProps {
  csrfToken?: string;
}

export function CredentialsForm(props: CredentialsFormProps) {
    const session = useSession()

    // if (session.status === 'authenticated') {
    //     signOut()
    // }

    const router = useRouter();
    const [error, setError] = useState<string | null>(null)
    const [redirecting, setRedirecting] = useState<boolean>(false)

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget)

        const signInResponse = await signIn("credentials", {
            email: data.get("email"),
            password: data.get("password"),
            redirect: false,
        });

        if (signInResponse && !signInResponse.error) {
        //Redirect to homepage (/timeline)
        //   router.push("/timeline");
        } else {
        setError("Your Email or Password is wrong!");
        }
    }

    useEffect(() => {
        if(session.status === 'authenticated' && redirecting === false) {
            const redirect = localStorage.getItem("redirectURL") || "/"
            localStorage.removeItem('redirectURL')
            setRedirecting(true)

            router.push(redirect)
        }
    }, [session])

    return (
        <form
            className="w-full mt-8 text-xl font-semibold flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            {error && (
                <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
                    {error}
                </span>
            )}
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
                    name="email"
                    required
                />
            </label>

            <label className="input input-primary input-lg input-bordered flex items-center gap-2 col-start-1">
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
                    name="password"
                />
            </label>

            <Link href="/signup" className="text-primary underline">
                Sign Up
            </Link>

            <button
                type="submit"
                className="w-full h-12 px-6 mt-4 text-lg text-white transition-colors duration-150 bg-blue-600 rounded-lg focus:shadow-outline hover:bg-blue-700"
            >
                Log in
            </button>
        </form>
    );
}