"use client"
import { siteURL } from '@/constants/requests/constants';
import { BookingI } from '@/interface/api/booking';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';


const PE = ({ 
    clientSecret,
    booking
}:{
    clientSecret: string
    booking: BookingI
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errMessage, setErrMessage] = useState<string>()

    if (!stripe || !elements) {
        return (
            <h1>Unable to load payment, please try again later</h1>
        )
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (elements == null) {
            return;
        }

        // Trigger form validation and wallet collection
        const {error: submitError} = await elements.submit();
        if (submitError) {
            // Show error to your customer
            setErrMessage(submitError.message || "");
            return;
        }

        // Create the PaymentIntent and obtain clientSecret from your server endpoint
        // const res = await fetch('/create-intent', {
        //     method: 'POST',
        // });

        // const {client_secret: clientSecret} = await res.json();

        const {error} = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${siteURL}/checkout/${booking.id}/success`,
            },
        });

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setErrMessage(error.message || "")
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            console.log("payment successful")
        }
    }

    if (errMessage) {
        alert(errMessage)
    }

    return (
        <form 
            onSubmit={handleSubmit}
            className='flex flex-col mx-2 border-blue-500 border-2 rounded-md p-4 max-w-3xl md:mx-auto mb-4'
        >
            <PaymentElement 
                options={{
                    defaultValues: {
                        billingDetails: {
                            email: booking.renter.email,
                            phone: booking.renter.phoneNumber
                        }
                    }
                }}
            />
            <button 
                type="submit" 
                disabled={!stripe || !elements}
                className='p-4 text-center rounded-md w-full bg-blue-500 mt-4 text-white'
            >
                Pay
            </button>
            {errMessage && <div>{errMessage}</div>}
        </form>
    )
}

export default PE