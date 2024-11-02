"use client"

import { bookingPaymentIntent, getBookingById } from "@/constants/requests/bookings"
import { BookingI } from "@/interface/api/booking"
import { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PE from "./PaymentElement";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)


const StripeCheckout = ({
    bookingId
}: {
    bookingId: string
}) => {

    const [ stripeData, setStripeData ] = useState<BookingI['stripe']>()
    const [ booking, setBooking ] = useState<BookingI>()

    // const stripe = useStripe()
    // const elements = useElements()

    const [errorMessage, setErrorMessage] = useState(null)

    const getBooking = async () => {
        const res = await getBookingById(bookingId)
        if (res.isErr) {
            alert("invalid booking id")
            return
        }

        setBooking(res.data)
    }

    const getPaymentIntent = async () => {
        const res = await bookingPaymentIntent(bookingId)
        if (res.isErr) {
            alert("Something went wrong")
            return
        }

        setStripeData(res.data)
    }

    useEffect(() => {
        getBooking()
    }, [])

    useEffect(() => {
        getPaymentIntent()
    }, [booking])

    if (!booking) {
        return (
            <h1 className="text-center font-bold text-lg">
                Booking not found
            </h1>
        )
    }

    console.log("client_secret", stripeData?.clientSecret)

    return (
        <section>
            <h3>{booking.vehicle.name}</h3>
            {stripeData?.clientSecret && 
                <Elements 
                    stripe={stripePromise} 
                    options={{ 
                        clientSecret: stripeData?.clientSecret
                    }}
                >
                    <PE clientSecret={stripeData.clientSecret} />
                </Elements>
            }
        </section>
    )
}

export default StripeCheckout