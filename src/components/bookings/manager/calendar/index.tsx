'use client'

import { bookingsFromTodayOn } from "@/constants/requests/bookings"
import Header from "./Header"
import { useRouter } from "next/navigation"
import { BookingI } from "@/interface/api/booking"
import { use, useEffect, useState } from "react"
import Loading from "@/components/assets/loading"
import { object, set } from "zod"
import CarRow from "./CarRow"
import { DateTime } from "luxon"

const Calendar = () => {
    const router = useRouter()
    const [dates, setDates] = useState<DateTime[]>([])
    const [bookings, setBookings] = useState<BookingI[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const handleGetBookings = async () => {
        try {
            setLoading(true)
            const res = await bookingsFromTodayOn()
    
            if (res.isErr) {
                if (res.status === 401) {
                    router.push('/manager/login')
                    return
                }
    
                if (res.status === 403) {
                    alert('Not authorized')
                    return
                }
    
                return
            }
    
            setBookings(res.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetBookings()

        const today = DateTime.now()

        const dates: DateTime[] = []
        for (let i = 0; i < 30; i++) {
            dates.push(today.plus({ days: i }))
        }
        setDates(dates)
    }, [])

    if (loading) return <Loading />

    if (!bookings) return (
        <h2 className="text-secondary text-2xl font-bold text-center">
            Someething went wrong. Please try again later
        </h2>
    )

    let carBookings: {[key: string]: BookingI[]} = {}

    bookings.forEach(booking => {
        if (carBookings[booking.vehicle.id]) {
            carBookings[booking.vehicle.id].push(booking)
        } else {
            carBookings[booking.vehicle.id] = [booking]
        }
    })

    console.log("carBookings", carBookings)

    return (
        <div className="overflow-x-scroll mt-4">
            <Header dates={dates} />
            <section id='bookings'>
                {Object.keys(carBookings).map((key, i) => <CarRow 
                    key={key} 
                    bookings={carBookings[key]} 
                    dates={dates}
                    onCarClick={function (carId: string): void {
                        throw new Error("Function not implemented.")
                    }}
                />
                )}
            </section>
        </div>
    )
}

export default Calendar