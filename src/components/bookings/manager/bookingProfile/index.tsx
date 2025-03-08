'use client'
import { BookingI, BookingStatusT } from "@/interface/api/booking"
import { useState } from "react"
import Schedule from "./schedule"
import Location from "./Location"
import Vehicle from "./Vehicle"
import Renter from "./renter"
import { RemBooking } from "@/constants/requests/bookings"
import { useRouter } from "next/navigation"
import Link from "next/link"
import RemBookingModal from "./RemBookingModal"
import CancelBookingModal from "./CancelBookingModal"


const BookingProfile = ({
    b,
    hydration
}: {
    b: BookingI
    hydration: () => void
}) => {
    const [booking, setBooking] = useState<BookingI>(b)
    const router = useRouter()

    const statusColors: {[key in BookingStatusT]: string} = {
        Scheduled: "yellow",
        "In Progress": "blue",
        Cancelled: "gray",
        Complete: "green",
        Blocked: "red",
        Draft: "black"
    }

    return (
        <section
            className="mx-3 md:mx-auto max-w-[1000px]"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-xl md:text-2xl mb-4">
                    Booking Details {" "}
                    <span
                        className={`text-bold text-white bg-${statusColors[booking.status]}-500 rounded-full py-2 px-2`}
                    >
                        {booking.status}
                    </span>
                </h1>
                {!booking.paidFor && <Link 
                    className="btn btn-accent"
                    href={`/manager/booking/${booking.id}?remove_booking=y`}
                >
                    Remove {booking.status === 'Blocked' ? "Blockage" : "Booking"}
                </Link>}
                {booking.status !== "Blocked" && <Link 
                    className="btn btn-secondary"
                    href={`/manager/booking/${booking.id}?cancel_booking=y`}
                >
                    Cancel Booking
                </Link>}
            </div>
            <div
                className="rounded-md shadow-[0px_0px_4px_1px] shadow-gray-400 overflow-hidden p-3 mb-56 md:grid grid-cols-8 gap-y-8 gap-x-2"
            >
                <Schedule 
                    startTime={booking.startTime}
                    endTime={booking.endTime}
                />
                {booking.status !== 'Blocked' && <Renter {...booking.renter}/>}
                {booking.status !== 'Blocked' && <Location 
                    pA={booking.pickupAddress}
                    dA={booking.dropOffAddress}
                    bId={booking.id}
                    hydration={hydration}
                />}
                <Vehicle {...booking.vehicle}/>
            </div>
            <RemBookingModal
                bookingId={booking.id}
                isBlocked={booking.status === 'Blocked'}
            />
            <CancelBookingModal
                booking={booking}
            />
        </section>
    )
}

export default BookingProfile