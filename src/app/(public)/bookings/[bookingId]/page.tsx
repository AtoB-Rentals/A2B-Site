import BookingProfile from "@/components/bookings/user/BookingProfile"
import { ApiRes, apiURL } from "@/constants/requests/constants"
import { BookingI } from "@/interface/api/booking"
import { getSession } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"
import { cookies } from "next/headers"
import { Metadata } from "next"
import { fromTimeI, timeFormat, timeUserFormat } from "@/constants/formatting/time"
import Link from "next/link"

/**
 * *undefined means that the error is a 401 or 403
 * all other errors should go notify that there was an error
 * 
 * @param bookingId 
 * @returns 
 */
const getBooking = async (bookingId: string) => {
    try {
        const c = await cookies()
        const cData = c.get('next-auth-token')

        if (!cData) {
            return null
        }

        const response = await fetch(`${apiURL}/api/bookings/${bookingId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                'Authorization': `Bearer ${cData.value}`
            },
            credentials: 'include'
        })

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return null
            }

            return null
        }

        const data = await response.json() as ApiRes<BookingI>

        return data.data

    } catch (e) {
        return null
    }
}

export async function generateMetadata({ params }: { params: { bookingId: string } }): Promise<Metadata> {
    const booking = await getBooking(params.bookingId)

    if (!booking) {
        return {
            title: "Booking Unknown"
        }
    }

    const startTime = fromTimeI(booking.startTime).toLocal()
    const endTime = fromTimeI(booking.endTime).toLocal()

    return {
        title: `${booking.vehicle.name} - ${startTime.toFormat('MM/dd/yyyy')}`,
        description: `${booking.vehicle.name} ${startTime.toFormat(timeUserFormat)} - ${endTime.toFormat(timeUserFormat)}`
    }
}

const BookingPage = async ({
    params
}: {
    params: { bookingId: string }
}) => {
    const booking = await getBooking(params.bookingId)
    if (!booking) {
        return (
            <section className=''>
                <p className='text-error text-lg text-center font-bold md:mx-4 motion-preset-slide-up-sm mb-4'>Booking not found</p>
                <div className="flex gap-x-2 justify-center motion-preset-slide-up-sm motion-delay-200">
                    <Link href="/bookings" className="btn btn-accent">
                        View Bookings
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <>
            
            <BookingProfile preBooking={booking} bookingId={params.bookingId}/>
        </>
    )
}

export default BookingPage