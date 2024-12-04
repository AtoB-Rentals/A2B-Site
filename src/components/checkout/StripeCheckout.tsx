"use client"

import { bookingPaymentIntent, getBookingById } from "@/constants/requests/bookings"
import { BookingI } from "@/interface/api/booking"
import { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PE from "./PaymentElement";
import { numToDallor } from "@/constants/formatting/money";
import Success from "./Success";

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

    // const stripe = useStripe()
    // const elements = useElements()

    const [errorMessage, setErrorMessage] = useState(null)

    const getBooking = async () => {
        try {
            await setLoading(true)
            const res = await getBookingById(bookingId)
            if (res.isErr) {
                alert("invalid booking id")
                return
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
                    await getBooking()
                    setStripeData(res.data)
                } else {
                    alert("Something went wrong")
                }

                return
            }
            
            await setStripeData(res.data)
            await getBooking()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPaymentIntent()
    }, [])

    if (loading) {
        return (
            <h1 className="text-center font-bold text-lg">
                Loading...
            </h1>
        )
    }

    if (!booking) {
        return (
            <h1 className="text-center font-bold text-lg">
                Booking not found
            </h1>
        )
    }

    return (
        <>
            {success && <Success booking={booking} />}
            <section>
                <div
                    className="flex flex-col gap-2 mx-2 border-2 border-blue-500 rounded-md p-2 mb-4 max-w-3xl md:mx-auto"
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

                {stripeData?.clientSecret && 
                    <Elements 
                        stripe={stripePromise} 
                        options={{ 
                            clientSecret: stripeData?.clientSecret,
                            appearance: {
                                theme: localStorage.getItem('theme') === "dark" ? "night" : "stripe",
                                labels: 'floating',
                            }
                        }}
                    >
                        <PE clientSecret={stripeData.clientSecret} />
                    </Elements>
                }
            </section>
        </>
    )
}

export default StripeCheckout