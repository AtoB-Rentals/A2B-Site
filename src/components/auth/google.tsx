"use client"

import Image from "next/image"
import { signIn } from "next-auth/react"


const GoogleBttn = () => {
    const handleClick = () => {
        signIn("google", undefined, {role: "manager"});
    }

    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-md md:text-xl  transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
        >
            <Image src="/images/google.png" alt="Google Logo" width={20} height={20} />
            <span className="ml-4">Continue with Google</span>
        </button>
    )
}

export default GoogleBttn