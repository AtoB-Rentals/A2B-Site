'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

const RedirectorToRentals = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/rentals')
    }, []) 

    return (
        <div
            className="text-blue-600 text-3xl text-center font-bold absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
        >
            <h1>Redirecting to rentals</h1>
        </div>
    )
}

export default RedirectorToRentals