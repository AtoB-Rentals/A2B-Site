'use client'
import { BookingI } from '@/interface/api/booking'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { bookingPaymentIntent, getBookingById } from '../../../constants/requests/bookings';
import Image from 'next/image';
import Hero from '../../home/Hero';
import { timeFormat } from '@/constants/formatting/time'
import Link from 'next/link';


const BookingProfile = ({
    preBooking,
    bookingId,
}:{
    preBooking: BookingI | null | undefined
    bookingId: string
}) => {
    const [booking, setBooking] = useState<BookingI | null>(null)
    const [errMsg, setErrMsg] = useState<string>('')
    const router = useRouter()
    const session = useSession()

    const loginRedict = () => {
        localStorage.setItem('redirectURL', `/bookings/${bookingId}`)
        router.push('/login')
    }

    if (session.status === 'unauthenticated') {
        loginRedict()
    }

    const retriveBooking = async () => {
        const res = await getBookingById(bookingId)

        if (res.isErr) {
            if (res.status === 401) {
                loginRedict()
            }

            if (res.status === 403) {
                setErrMsg("You are not authorized to view this booking")
            }
            return
        }

        setErrMsg("")

        setBooking(res.data)
    }

    useEffect(()=> {
        if (preBooking) {
            setBooking(preBooking)
        } else {
            retriveBooking()
        }
    }, [])

    if (errMsg) {
        return (
            <section className='rounded-md shadow-[0px_0px_4px_1px] flex flex-col items-center md:items-start py-3 px-2 gap-2 md:grid grid-cols-3 auto-cols-max mb-12 max-w-[1000px] mx-3 lg:mx-auto'>
                <p className='text-error text-lg text-center font-bold md:mx-4 md:text-left'>{errMsg}</p>
            </section>
        )
    }

    if (!booking) { 
        return (
            <section className='rounded-md shadow-[0px_0px_4px_1px] flex flex-col items-center md:items-start py-3 px-2 gap-2 md:grid grid-cols-3 auto-cols-max mb-12 max-w-[1000px] mx-3 lg:mx-auto'>
                <p className='text-error text-lg text-center font-bold md:mx-4 md:text-left'>Booking not found</p>
            </section>
        )
    }

    return (
        <section className='rounded-md shadow-[0px_0px_4px_1px] flex flex-col md:items-start py-3 px-2 gap-4 md:grid grid-cols-3 auto-cols-max mb-12 max-w-[1000px] mx-3 lg:mx-auto'>

            {/* Vehicle */}
            <div className='col-start-1 col-span-1 md:col-end-4 flex justify-between'>
                <div className='relative h-32 w-32 md:h-40 md:w-40'>
                    <Image 
                        src={booking.vehicle.profilePicture.url}
                        alt={booking.vehicle.name}
                        layout='fill'
                        className='object-cover rounded-lg left-0 absolute'
                    />
                </div>
                <div className='text-right'>
                    <h1 className='font-bold text-xl text-primary text-center'>
                        {booking.vehicle.name}
                    </h1>
                    <p className=''>
                        {booking.vehicle.passengers} Passenger
                    </p>
                    <p className=''>
                        {booking.vehicle.type}
                    </p>
                </div>
            </div>

            {/* Time */}
            <div className='col-start-1 col-end-4'>
                <div className='flex justify-around items-center gap-x-4 gap-y-2'>
                    <div className='text-center'>
                        <p className='text-lg font-bold'>{timeFormat(booking.startTime, "MM/dd/yyyy")}</p>
                        <p className='text-lg font-bold'>{timeFormat(booking.startTime, "t")}</p>
                    </div>

                    <span className='block w-full h-1 rounded-full bg-gradient-to-r from-primary to-secondary mx-auto max-w-xl'></span>

                    <div className='text-center'>
                        <p className='text-lg font-bold'>{timeFormat(booking.endTime, "MM/dd/yyyy")}</p>
                        <p className='text-lg font-bold'>{timeFormat(booking.endTime, "t")}</p>
                    </div>
                </div>
            </div>

            {/* Pickup location */}
            <div className='md:flex flex-col md:flex-row col-start-1 col-end-4 justify-between gap-4 text-center md:text-left'>
                <Link 
                    className='block w-full shadow-[0px_0px_4px_1px] rounded-lg mb-4 shadow-success px-2 py-2 hover:brightness-125 transition-all ease-in-out'
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.pickupAddress.formatted)}`}
                    target='_blank'
                >
                    <h3 className='font-extrabold text-xl text-secondary'>Pickup</h3>
                    <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.pickupAddress.formatted)}`}
                        target='_blank'
                        className='text-ellipsis'
                    >
                        {booking.pickupAddress.formatted}
                    </Link>
                </Link>
                <Link 
                    className='block w-full shadow-[0px_0px_4px_1px] rounded-lg mb-4 shadow-error px-2 py-2 hover:brightness-125 transition-all ease-in-out'
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.dropOffAddress.formatted)}`}
                    target='_blank'
                >
                    <h3 className='font-extrabold text-xl text-secondary'>Drop Off</h3>
                    <p>
                        {booking.dropOffAddress.formatted}
                    </p>
                </Link>
            </div>
            {/* Actions */}
            <div className='flex gap-4 justify-between col-start-1 col-end-4'>
                <button 
                    className='btn btn-error'
                >
                    Cancel
                </button>
            </div>
        </section>
    )
}

export default BookingProfile