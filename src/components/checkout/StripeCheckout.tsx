"use client"

import { bookingPaymentIntent, getBookingById, updateRenter } from "@/constants/requests/bookings"
import { BookingI } from "@/interface/api/booking"
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PE from "./PaymentElement";
import { numToDallor } from "@/constants/formatting/money";
import { useRouter } from "next/navigation";
import Loading from "../assets/loading";
import { useSession } from "next-auth/react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)


const StripeCheckout = ({
    bookingId
}: {
    bookingId: string
}) => {
    const [ stripeData, setStripeData ] = useState<BookingI['stripe']>()
    const [ booking, setBooking ] = useState<BookingI>()
    const [ success, setSuccess ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(true)
    const router = useRouter()

    const session = useSession()

    const getBooking = async () => {
        try {
            await setLoading(true)
            const res = await getBookingById(bookingId)
            if (res.isErr) {
                if (res.status === 404) {
                    alert(res.message)
                    return
                }

                if (res.status === 500) {
                    alert("An error occurred. Please try again later.")
                    return
                }
                return
            }

            const bookingData = res.data

            if (bookingData.paidFor) {
                router.push(`/checkout/${bookingData.id}/success`)
            }
            
            setBooking(res.data)
        } finally {
            setLoading(false)
        }
    }

    const getPaymentIntent = async () => {
        try {
            await setLoading(true)
            const res = await bookingPaymentIntent(bookingId)
            if (res.isErr) {
                if (res.message === "vehicle is already paid for") {
                    setSuccess(true)
                    router.push(`/checkout/${bookingId}/success`)
                }

                return
            }
            
            await setStripeData(res.data)
            await getBooking()
        } finally {
            setLoading(false)
        }
    }

    const handleUpdaterRenter = async () => {
        if (session.status !== 'authenticated' || !booking) return
        const res = await updateRenter(bookingId, {
            email: session.data.user.email,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            dob: ""
        })
        if (res.isErr) {
            return
        }
        setBooking(res.data)
    }

    useEffect(() => {
        getBooking()
            .then(() => getPaymentIntent())
    }, [])

    useEffect(() => {
        if (session.status === 'authenticated') {
            if (!!booking) {
                if (session?.data?.user?.email !== booking?.renter?.email) {
                    handleUpdaterRenter()
                }
            }
        } else if (session.status === 'unauthenticated') {
            localStorage.setItem(
                'redirectURL', 
                `/checkout/${bookingId}?}`
            )

            router.push('/login')
        }
    }, [session])

    if (loading) return <Loading />

    if (!booking) {
        return (
            <h1 className="text-center font-bold text-lg">
                Booking not found
            </h1>
        )
    }

    return (
        <>
            <section>
                <div
                    className="flex flex-col gap-2 mx-2 border-2 border-blue-500 rounded-md p-2 mb-4 max-w-3xl md:mx-auto motion-translate-x-in-[-23%] motion-translate-y-in-[14%] motion-rotate-in-[22deg]"
                >
                    {booking.stripe?.items?.length && booking.stripe?.items?.map(item => (
                        <div
                            key={item.id}
                            className="flex justify-between w-full items-center"
                        >
                            <div>
                                <p className="font-bold">{item.name}</p>
                                <p className="italic">{item.description}</p>
                            </div>
                            <p>${numToDallor(item.amount)}</p>
                        </div>
                    ))}
                    <span className="block h-[2px] w-full bg-blue-500 rounded-full"></span>
                    <div
                        className="flex justify-between w-full font-bold text-lg"
                    >
                        <p>Total</p>
                        <p className="font-bold text-lg text-green-600">
                            ${numToDallor(booking.totalPrice)}
                        </p>
                    </div>
                </div>

                {stripeData?.clientSecret ? 
                    <Elements 
                        stripe={stripePromise} 
                        options={{ 
                            clientSecret: stripeData?.clientSecret,
                            appearance: {
                                theme: localStorage.getItem('theme') === "dark" ? "night" : "stripe",
                                labels: 'floating',
                            },
                        }}
                    >
                        <PE 
                            clientSecret={stripeData.clientSecret}
                            booking={booking}
                        />
                    </Elements> : <Loading />
                }
            </section>
        </>
    )
}

export default StripeCheckout