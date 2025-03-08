import ScheduleBlockCarPop from "@/components/modals/ScheduleBlockCar"
import { fromTimeI } from "@/constants/formatting/time"
import { BookingI } from "@/interface/api/booking"
import { DateTime } from "luxon"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CarRow = ({ 
    bookings, 
    dates,
    // onCarClick
}: {
    bookings: BookingI[],
    dates: DateTime[]
    // onCarClick: (carId: string) => void
}) => {
    const booking = bookings[0]
    
    const router = useRouter()

    return (
        <>
            <div className="flex border-b-2 border-primary border-dashed">
                <div 
                    className="bg-base-300 w-32 flex flex-col items-center justify-center gap-2 border-r-2 border-primary shrink-0"
                    onClick={() => router.push(`/manager/bookings/calendar?block_rental=y&car_id=${booking.vehicle.id}`)}
                >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image 
                            src={booking.vehicle.profilePicture.url || '/images/sedan.png'}
                            alt={booking.vehicle.name}
                            layout="fill"
                            className="mx-auto object-cover"
                        />
                    </div>
                    <p className="text-primary text-center">
                        {booking.vehicle.name}
                    </p>
                </div>
                {dates.map((date, index) => {
                    let bookingStartTime: DateTime | null = null
                    let bookingDuration: number = 0
                    let theBooking: BookingI = bookings[0]

                    bookings.forEach(b => {
                        if (date.hasSame(fromTimeI(b.startTime), 'day')) {
                            bookingStartTime = fromTimeI(b.startTime)
                            bookingDuration = fromTimeI(b.endTime).diff(bookingStartTime, 'days').as('days')
                            theBooking = b
                        }
                    })

                    if (!bookingStartTime || !theBooking) return (
                        <div key={`No start - ${index}`} className="bg-base-300 w-32 flex flex-col items-center justify-center gap-2 border-r-2 border-primary shrink-0">
                        
                        </div>
                    )

                    let color = theBooking.status === "Blocked" ? "bg-error" : "bg-gradient-to-r from-primary via-secondary to-primary"

                    return (
                        <div 
                            key={date.toFormat('yyyy-MM-dd') + index.toString()} 
                            className="relative bg-base-300 w-32 flex flex-col items-center justify-center gap-2 border-r-2 border-primary shrink-0"
                            // onClick={() => onCarClick(booking.vehicle.id)}
                        >
                            <Link
                                href={`/manager/booking/${theBooking.id}`} 
                                className={`block absolute left-1/2 z-50 h-3 bg-secondary rounded-full ${color} cursor-pointer`}
                                style={{ width: `${bookingDuration * 128}px` }}
                            >
                                
                            </Link>
                        </div>
                    )
                    }
                )}
            </div>
            <ScheduleBlockCarPop />
        </>
    )
}

export default CarRow;