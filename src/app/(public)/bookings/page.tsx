import { defaultFormat, timeFormat } from "@/constants/formatting/time"
import { ApiRes, apiURL } from "@/constants/requests/constants"
import { BookingI } from "@/interface/api/booking"

import { getSession } from "next-auth/react"
import { cookies } from 'next/headers'
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

const bookingsFromTodayOn = async () => {
    try {
        const c = await cookies()
        const cData = c.get('next-auth-token')

        if (!cData) {
            return []
        }

        const response = await fetch(`${apiURL}/api/bookings/from_today_on`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                'Authorization': `Bearer ${cData.value}`
            },
            credentials: 'include'
        })

        if (!response.ok) {
            return []
        }
    
        
        const data = await response.json() as ApiRes<BookingI[]>
        return data.data

    } catch (e) {
        return []
    }
}

const BookingsPage = async () => {
    const c = await cookies()
    if (!c.get('next-auth-token')?.value) {
        redirect('/login') 
    }

    const bookings = await bookingsFromTodayOn()
    return (
        <main>
            <section>
                <div className="">
                    <h2 className="text-secondary text-3xl font-bold text-center">Upcoming</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center"></div>
                <div className="flex flex-col justify-center items-center gap-4 mx-auto md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:justify-items-center max-w-7xl">
                    {bookings.map((b, i) => {
                        

                        return (
                            <Link
                                key={b.id} 
                                className="pt-2 card bg-base-100 w-96 shadow-2xl my-4 border-2 border-base-200 hover:motion-safe:animate-pulse"
                                href={`/bookings/${b.id}`}
                            >
                                <figure>
                                    <div className="relative h-36 w-80">
                                        <Image 
                                            src={b.vehicle.profilePicture.url || "/images/sedan.png"} 
                                            alt={b.vehicle.name}
                                            layout="fill"
                                            className="object-cover w-full rounded-xl"
                                        />
                                    </div>
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">{b.vehicle.name}</h2>
                                    <p>{timeFormat(b.startTime, 'MM/dd/yyyy')} - {timeFormat(b.endTime, 'MM/dd/yyyy')}</p>
                                    {/* <div className="card-actions">
                                        <button className="btn btn-primary">Buy Now</button>
                                    </div> */}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </main>
    );
}

export default BookingsPage