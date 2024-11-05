import StripeCheckout from "@/components/checkout/StripeCheckout"
import { getBookingById } from "@/constants/requests/bookings"
import { apiURL } from "@/constants/requests/constants"
import { BookingI } from "@/interface/api/booking"

const handleGetBooking = async (bookingId: string): Promise<BookingI | null> => {
    try {
        const res = await fetch(`${apiURL}/api/bookings/${bookingId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })

        if (!res.ok) {
            return null
        }

        return await res.json() as BookingI
    } catch {
        return null
    }
}


const CheckoutPage = async ({
    params
}: {
    params: {
        bookingId: string
    }
}) => {
    console.log("params", params.bookingId)

    return (
        <div>
            <h1
                className="text-center font-bold text-2xl"
            >
                Checkout
            </h1>
            <StripeCheckout 
                bookingId={params.bookingId}
            />
        </div>

    )
}

export default CheckoutPage