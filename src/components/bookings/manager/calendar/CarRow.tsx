import { fromTimeI } from "@/constants/formatting/time"
import { BookingI } from "@/interface/api/booking"
import { DateTime } from "luxon"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const CarRow = ({ 
    bookings, 
    dates,
    onCarClick
}: {
    bookings: BookingI[],
    dates: DateTime[]
    onCarClick: (carId: string) => void
}) => {
    const booking = bookings[0]

    return (
        <div className="flex border-b-2 border-primary border-dashed">
            <div className="bg-base-300 w-32 flex flex-col items-center justify-center gap-2 border-r-2 border-primary shrink-0">
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
            {dates.map(date => {
                let bookingStartTime: DateTime | null = null
                let bookingDuration: number = 0

                bookings.forEach(b => {
                    if (date.hasSame(fromTimeI(b.startTime), 'day')) {
                        bookingStartTime = fromTimeI(b.startTime)
                        bookingDuration = fromTimeI(b.endTime).diff(bookingStartTime, 'days').as('days')
                    }
                })

                if (!bookingStartTime) return (
                    <div className="bg-base-300 w-32 flex flex-col items-center justify-center gap-2 border-r-2 border-primary shrink-0">
                    
                    </div>
                )

                const test = (bookingDuration*128).toString()

                return (
                    <div 
                        key={date.toFormat('yyyy-MM-dd')} 
                        className="relative bg-base-300 w-32 flex flex-col items-center justify-center gap-2 border-r-2 border-primary shrink-0"
                        onClick={() => onCarClick(booking.vehicle.id)}
                    >
                        <Link
                            href={`/manager/booking/${booking.id}`} 
                            className={`block absolute left-1/2 z-50 h-3 bg-secondary w-[${test}px] rounded-full bg-gradient-to-r from-primary via-secondary to-primary`}
                            style={{ width: `${bookingDuration * 128}px` }}
                        >
                            
                        </Link>
                    </div>
                )
                }
            )}
        </div>
    )
}

export default CarRow;