'use client'

import BookingProfile from "@/components/bookings/bookingProfile"
import { getBookingById } from "@/constants/requests/bookings"
import { BookingI } from "@/interface/api/booking"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Booking = ({ params }: {
    params: { 
        bookingId: string
    }
}) => {
    const [booking, setBooking] = useState<BookingI>()
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()

    const handleGetBookings = async () => {
        setLoading(true)
        const res = await getBookingById(params.bookingId)

        if (res.isErr) {
            alert('Booking not found')
            router.push('/manager/bookings')
            return
        }

        setBooking(res.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetBookings()
    }, [])

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (!booking) {
        alert('booking not found')
        return <main>
            <h1>Booking not found</h1>
        </main>
    }

    return (
        <main>
            <BookingProfile b={booking}/>
        </main>
    )
}

export default Booking