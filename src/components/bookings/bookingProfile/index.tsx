'use client'
import { BookingI } from "@/interface/api/booking"
import { useState } from "react"
import Renter from "./renter"
import Schedule from "./schedule"


const BookingProfile = ({
    b
}: {
    b: BookingI
}) => {
    const [booking, setBooking] = useState<BookingI>(b)

    return (
        <section
            className="max-w-[1000px] mx-3 lg:mx-auto rounded-md shadow-[0px_0px_4px_1px] shadow-gray-400 overflow-hidden p-3 mb-56"
        >
            <Schedule 
                startTime={booking.startTime}
                endTime={booking.endTime}
            />
            <Renter {...booking.renter}/>
        </section>
    )
}

export default BookingProfile