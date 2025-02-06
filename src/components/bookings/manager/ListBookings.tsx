'use client'
import { useEffect, useState } from 'react';
import { BookingI } from '../../../interface/api/booking';
import { bookingsFromTodayOn } from '@/constants/requests/bookings';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import { DateTime } from 'luxon';
import Link from 'next/link';

interface StagedBookingI extends BookingI {
    isDropoffDate: boolean;
}

const groupBookingsBySameDay = (bookings: BookingI[]): { [date: string]: StagedBookingI[] } => {
    if (bookings.length === 0) return {};

    return bookings.reduce((grouped: Record<string, StagedBookingI[]>, booking: BookingI) => {
        // Helper to handle grouping both start and end times
        const addToGroup = (goTime: Date, isDropoffDate: boolean) => {
            const dateTime = DateTime.fromJSDate(goTime).toLocal();
            let date = "";

            if (dateTime.hasSame(DateTime.now(), "day")) {
                date = "Today - " + dateTime.toFormat('LLL d, yyyy')
            } else if (dateTime.hasSame(DateTime.now().plus({ days: 1 }), "day")) {
                date = "Tomorrow - " + dateTime.toFormat('LLL d, yyyy');
            } else {
                date = dateTime.toFormat('LLL d, yyyy');
            }

            if (!grouped[date]) {
                grouped[date] = [];
            }

            // Add the booking with isDropoffDate flag
            grouped[date].push({
                ...booking,
                isDropoffDate: isDropoffDate
            });
        };

        // Add start time (isDropoffDate: false)
        addToGroup(new Date(booking.startTime.goTime), false);

        // Add end time (isDropoffDate: true)
        addToGroup(new Date(booking.endTime.goTime), true);

        return grouped;
    }, {});
}

const BookingDateGroup = ({
    date,
    bookings
}:{
    date: string
    bookings: StagedBookingI[]
}) => (
    <div className='mb-3 md:mx-auto max-w-4xl md:rounded-lg md:shadow-md overflow-hidden'>
        <div className='bg-blue-600 text-white text-center md:text-left py-1 px-2'>
            <h2 className='text-2xl font-bold'>{date}</h2>
        </div>
        {bookings.map(b => (
            <Link 
                className='flex items-start justify-between p-2 border-b-2 border-blue-600 last:border-b-0 cursor-pointer'
                key={b.id}
                href={`/manager/booking/${b.id}`}
            >
                <div>
                    <h2
                        className={`font-bold text-xl ${b.isDropoffDate && "text-red-600"}`}
                    >{b.vehicle.name}</h2>
                    <p className='italic'>{b.pickupAddress.formatted}</p>
                    <p>{`${b.renter.firstName} ${b.renter.lastName}`}</p>
                    <p>{DateTime.fromJSDate(new Date(b.startTime.goTime)).toFormat("hh:mm a")}</p>

                </div>
                <div>

                </div>
            </Link>
        ))}
    </div>
)

const ListBookings = () => {
    const [bookings, setBookings] = useState<BookingI[]>([])
    const router = useRouter()

    const handleGetBookings = () => {
        bookingsFromTodayOn()
            .then(res => {
                if(res.isErr) {
                    if (res.status === 401) {
                        Cookies.remove("token")
                        router.push('/manager/login')
                    }
                } else {
                    setBookings([...res.data])
                }
            })
    }

    useEffect(() => {
        handleGetBookings()
    }, [])

    const groupedBookings = groupBookingsBySameDay(bookings)
    const dates = Object.entries(groupedBookings)

    return (
        <section>
            {bookings.length === 0 && <h1>
                Couldn't find any bookings    
            </h1>}
            <div className='mt-2'>
                {dates.map(([date, bs]) => (
                    <BookingDateGroup date={date} bookings={bs} key={date} />
                ))}
            </div>
        </section>
    )
}

export default ListBookings