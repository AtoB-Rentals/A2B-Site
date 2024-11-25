"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

const CheckoutPageNoBookingID = () => {
    const router = useRouter()
    useEffect(() => {
        router.push("/")
    }, [])

    return (
        <h1 className="text-center font-bold text-lg">
            Booking not found
        </h1>
    )
}

export default CheckoutPageNoBookingID